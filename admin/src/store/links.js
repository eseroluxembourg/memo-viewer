'use strict';
import matter from 'gray-matter';

import { defineStore } from 'pinia';

import { useSettingsStore } from '@/store/settings';
import { useGitlabStore } from '@/store/gitlab';
import { useStorage } from '@vueuse/core';
import { listModifications, objectWithAppliedModifications, setModification, computeActiveLangs, generateGitlabActions } from '@/utils/modifications';
import { randomElement, generateUuid8, previousElement, nextElement } from '@/utils/utils';
import { useCardsStore } from '@/store/cards';
import { findBestAvailableLang } from '!/src/utils/i18n.js';

export const useLinksStore = defineStore('links', {
    state: () => {
        return {
            // [linkId] { fromCardId: 0, toCardId: 0, status: '', explanations: { 'fr-FR': '' }}
            _links: {},
            loading: false,
            _modifications: useStorage(`${useSettingsStore().repo}/links/modifications`, {}, localStorage),
        };
    },
    getters: {
        linkIds: (state) => {
            return Object.keys(state._modifications);
        },
        previousLinkId: (state) => {
            return (linkId) => {
                return previousElement(state.linkIds, linkId);
            };
        },
        nextLinkId: (state) => {
            return (linkId) => {
                return nextElement(state.linkIds, linkId);
            };
        },
        links: (state) => {
            return state._links;
        },
        edges: (state) => {
            return (
                state.linkIds
                    .map((linkId) => state.link(linkId))
                    // TODO?
                    .filter((link) => link.status !== undefined)
                    .map((link) => {
                        return {
                            from: link.fromCardId.value,
                            to: link.toCardId.value,
                            status: link.status.value,
                            class: link.class ? link.class.value : [],
                        };
                    })
            );
        },
        changed: (state) => {
            return (linkId) => {
                return state.linkModifications(linkId).length > 0;
            };
        },
        hasModifications: (state) => {
            for (const linkId of state.linkIds) {
                if (state.changed(linkId)) return true;
            }
            return false;
        },
        flatModifications: (state) => {
            let allModifications = [];
            for (const linkId of state.linkIds) {
                allModifications = allModifications.concat(state.linkModifications(linkId));
            }
            return allModifications;
        },
        linkModifications: (state) => {
            return (linkId) => {
                return listModifications(linkId, state._links[linkId], state._modifications[linkId]);
            };
        },
        listModifiedLinkFiles: (state) => {
            return (linkId) => {
                const files = generateGitlabActions(
                    state.link(linkId),
                    state.isNew(linkId),
                    (id) => `_links/${id}/index.md`,
                    (id, i18n) => `_links/${id}/${i18n}/index.md`,
                    'explanations',
                    ['fromCardId', 'toCardId', 'status', 'class'],
                    state.existingLangs(linkId),
                    linkId,
                    [],
                );
                return files;
            };
        },
        allModifiedFiles: (state) => {
            let allModifiedFiles = [];
            for (const linkId of state.linkIds) {
                allModifiedFiles = allModifiedFiles.concat(state.listModifiedLinkFiles(linkId));
            }
            return allModifiedFiles;
        },
        link: (state) => {
            return (linkId) => {
                const result = objectWithAppliedModifications(state._links[linkId], state._modifications[linkId]);
                result.langs = computeActiveLangs(result);
                result.fetched =
                    state.isNew(linkId) || (state._links[linkId] !== undefined && state._links[linkId].commit === useGitlabStore().getLastCommit());
                return result;
            };
        },
        statusList: () => {
            return ['valid', 'optional', 'invalid', 'temporary', 'optional'];
        },
        existingLangs: (state) => {
            return (linkId) => {
                if (state.isNew(linkId)) return new Set();
                return state._links[linkId].existingLangs;
            };
        },
    },
    actions: {
        buildId(fromCardId, toCardId) {
            return fromCardId + '_' + toCardId;
        },
        splitId(linkId) {
            const s = linkId.split('_');
            return { fromCardId: s[0], toCardId: s[1] };
        },
        isNew(linkId) {
            return linkId[0] === '_';
        },
        async createLink() {
            const cardsStore = useCardsStore();
            await cardsStore.fetchCards();

            const fromCardId = randomElement(Object.keys(cardsStore.cards));
            const toCardId = randomElement(Object.keys(cardsStore.cards));

            const linkId = '_' + generateUuid8();
            const link = {
                id: this.buildId(fromCardId, toCardId),
                fromCardId: fromCardId,
                toCardId: toCardId,
                status: 'valid',
                removed: false,
                explanations: { 'fr-FR': '' }, // Ugly. TODO fixme
            };
            this._modifications[linkId] = link;
            return linkId;
        },
        async fetchLinks() {
            if (Object.keys(this._links).length > 0) return;

            this.loading = true;
            const treeFiles = await useGitlabStore().listFiles('_links', 1, true);
            if (treeFiles['_links'] === undefined) {
                this.loading = false;
                return; // No Links
            }
            const linkIds = Object.keys(treeFiles['_links']);
            delete this._links;
            this._links = {};

            for (const linkId of linkIds) {
                if (linkId === '.gitkeep') continue;
                if (linkId === 'linksStyle.json') continue;
                if (!this._modifications[linkId]) this._modifications[linkId] = {};
                const { fromCardId, toCardId } = this.splitId(linkId);
                this._links[linkId] = {
                    id: linkId,
                    existingLangs: new Set(Object.keys(treeFiles['_links'][linkId])),
                    explanations: {},
                    fromCardId: fromCardId,
                    toCardId: toCardId,
                    status: undefined,
                    removed: false,
                    class: [],
                };
                await this.fetchLink(linkId, true);
            }

            // Remove removed/moved links from the list (see #171)
            const treeLinkIds = new Set(linkIds);
            for (const linkId of this.linkIds) {
                if (this.isNew(linkId)) continue;
                if (treeLinkIds.has(linkId)) continue;
                if (Object.keys(this._modifications[linkId]).length > 0) {
                    console.warn(`You had modification for link ${linkId} but it has been removed.`);
                }
                delete this._modifications[linkId];
            }
            setTimeout(() => (this.loading = false), 0);
        },
        async prefetchLink(linkId, onlyCache) {
            await this.fetchLinks();
            const link = this._links[linkId];
            if (link === undefined) return;
            const defaultLang = findBestAvailableLang(undefined, Array.from(link.existingLangs));
            await this.fetchLinkLangData(linkId, defaultLang, onlyCache);
        },
        async fetchLink(linkId, onlyCache) {
            if (this.isNew(linkId)) return;
            await this.fetchLinks();

            const link = this._links[linkId];

            const promises = [];
            for (const lang of link.existingLangs) {
                promises.push(this.fetchLinkLangData(linkId, lang, onlyCache));
            }
            await Promise.all(promises);

            // Remove already applied modifications
            const modifications = this.linkModifications(linkId);
            for (const k in modifications) {
                const modif = modifications[k];
                if (modif['newValue'] === modif['oldValue'] || (modif['newValue'].removed && modif['oldValue'] === undefined))
                    this.setModification(linkId, modif['i18n'], modif['field'], undefined);
            }
        },
        async prefetchAllLinks() {
            await this.fetchLinks();
            const promises = [];
            for (const linkId of this.linkIds) {
                promises.push(this.prefetchLink(linkId));
            }
            await Promise.all(promises);
        },
        async fetchAllModifiedLinks() {
            await this.fetchLinks();
            const promises = [];
            for (const linkId in this._links) {
                if (!this.changed(linkId)) continue;
                promises.push(this.fetchLink(linkId));
            }
            await Promise.all(promises);
        },

        setLinkAttribute(linkId, attribute, value, raiseIfChanged) {
            if (raiseIfChanged && value !== this._links[linkId][attribute])
                console.warn(`Value ${attribute} for link ${linkId} seems to be corrupted`);
            this._links[linkId][attribute] = value;
        },
        async fetchLinkLangData(linkId, i18n, onlyCache) {
            if (this._links[linkId]['explanations'][i18n]) return;

            const file = await useGitlabStore().requestFile(`_links/${linkId}/${i18n}/index.md`, onlyCache !== undefined ? 2 : 1);
            if (file === undefined) return undefined;

            const parsedMd = matter(file);
            const attributes = parsedMd.data;

            this._links[linkId]['explanations'][i18n] = parsedMd.content;

            this.setLinkAttribute(linkId, 'fromCardId', attributes['fromCardId']);
            this.setLinkAttribute(linkId, 'toCardId', attributes['toCardId']);
            this.setLinkAttribute(linkId, 'status', attributes['status']);
            this.setLinkAttribute(linkId, 'class', attributes['class']);
            this.setLinkAttribute(linkId, 'id', linkId);

            this._links[linkId].commit = useGitlabStore().getLastCommit();
        },
        // Undo with value = undefined
        // Impossible to undo a just added links
        setModification(linkId, i18n, field, value) {
            setModification(this._links, this._modifications, linkId, i18n, field, value);
            if (field === 'fromCardId' || field === 'toCardId') {
                const link = this.link(linkId);
                if (this.isNew(linkId) && (link.fromCardId == undefined || link.toCardId == undefined)) {
                    console.warn(`Impossible to recompute id for new link ${linkId}. It's okay if we are uploading modifications file.`);
                    return;
                }
                setModification(this._links, this._modifications, linkId, undefined, 'id', this.buildId(link.fromCardId.value, link.toCardId.value));
            }
        },
        checkValidity(linkId) {
            const result = { valid: true, messages: [] };
            const _link = this.link(linkId);
            if (_link.langs.size === 0 && !_link.removed.value) {
                result.valid = false;
                result.messages.push(`A link should define at least one lang. Link ${linkId} has no lang`);
            }

            // TODO: check duplicated ids
            if (linkId !== _link.id.value) {
                for (const otherId of this.linkIds) {
                    if (otherId === linkId) continue;
                    if (this.link(otherId).id.value === _link.id.value) {
                        result.valid = false;
                        result.messages.push(`It's impossible to have multiple links with same idea (id: ${_link.id.value})`);
                    }
                }
            }

            // TODO: check if id === buildFrom
            // TODO: check if all fields are defined
            return result;
        },
        checkValidityForAll() {
            const result = { valid: true, messages: [] };
            for (const linkId of this.linkIds) {
                if (!this.changed(linkId)) continue;
                const validity = this.checkValidity(linkId);
                if (validity.valid) continue;
                result.valid = false;
                result.messages = result.messages.concat(validity.messages);
            }
            return result;
        },
        clearModifications() {
            this._modifications = {};
            for (const linkId in this._links) {
                this._modifications[linkId] = {};
            }
        },
        resetLinks() {
            delete this._links;
            this._links = {};
        },
    },
});

'use strict';

import { defineStore } from 'pinia';

import { useSettingsStore } from '@/store/settings';
import { useGitlabStore } from '@/store/gitlab';
import { useStorage } from '@vueuse/core';
import { objectWithAppliedModifications, computeActiveLangs, setModification, listModifications } from '@/utils/modifications';
import { previousElement, nextElement, generateUuid8 } from '@/utils/utils';

import { validateFresk } from '!/data-validation';

export const useFresksStore = defineStore('fresks', {
    state: () => {
        const settings = useSettingsStore();
        return {
            _fresks: {},
            _modifications: useStorage(`${settings.repo}/fresks/modifications`, {}, localStorage),
            loading: false,
        };
    },
    getters: {
        freskIds: (state) => {
            return Object.keys(state._modifications);
        },
        previousFreskId: (state) => {
            return (freskId) => {
                return previousElement(state.freskIds, freskId);
            };
        },
        nextFreskId: (state) => {
            return (freskId) => {
                return nextElement(state.freskIds, freskId);
            };
        },
        fresks: (state) => {
            return state._fresks;
        },
        changed: (state) => {
            return (freskId) => {
                return state.freskModifications(freskId).length > 0;
            };
        },
        fresk: (state) => {
            return (freskId) => {
                const result = objectWithAppliedModifications(state._fresks[freskId], state._modifications[freskId]);
                result.langs = computeActiveLangs({ title: result.title }); // Ignore non-i18n fields nodes / backgrounds / etc.
                result.fetched =
                    state.isNew(freskId) ||
                    (state._fresks[freskId] !== undefined && state._fresks[freskId].commit === useGitlabStore().getLastCommit());
                return result;
            };
        },
        hasModifications: (state) => {
            for (const freskId of state.freskIds) {
                if (state.changed(freskId)) {
                    return true;
                }
            }
            return false;
        },
        flatModifications: (state) => {
            let allModifications = [];
            for (const freskId of state.freskIds) {
                allModifications = allModifications.concat(state.freskModifications(freskId));
            }
            return allModifications;
        },
        freskModifications: (state) => {
            return (freskId) => {
                return listModifications(freskId, state._fresks[freskId], state._modifications[freskId]);
            };
        },
        listModifiedFreskFiles: (state) => {
            return (freskId) => {
                // No new fresk, no id change for now
                if (!state.changed(freskId)) return [];
                const fresk = state.fresk(freskId);

                const freskData = {
                    nodes: Object.values(fresk.nodes)
                        .filter((node) => node.value.removed === undefined || !node.value.removed)
                        .map((node) => ({
                            xPos: node.value.xPos,
                            yPos: node.value.yPos,
                            cardId: node.value.cardId,
                            zoom: node.value.zoom,
                        })),
                    edges: Object.values(fresk.edges).map((edge) => ({
                        from: edge.value.from,
                        to: edge.value.to,
                        status: edge.value.status,
                    })),
                    background: fresk.background.value,
                    version: useSettingsStore().version,
                    lot: fresk.lot.value,
                    variants: fresk.variants.value,
                };

                freskData.title = {};
                for (const i18n in fresk.title) {
                    freskData.title[i18n] = fresk.title[i18n].value;
                }

                if (!validateFresk(freskData)) {
                    console.error(`Not valid fresk ${freskId}`);
                    console.error(validateFresk.errors);
                    return [];
                }
                const oldFreskId = freskId;
                const newFreskId = fresk.id.value;
                return [
                    {
                        action: state.isNew(freskId) ? 'create' : newFreskId == oldFreskId ? 'update' : 'move',
                        file_path: `_fresks/${newFreskId}.json`,
                        previous_path: `_fresks/${oldFreskId}.json`,
                        content: JSON.stringify(freskData, null, 4),
                    },
                ];
            };
        },
        allModifiedFiles: (state) => {
            let allModifiedFiles = [];
            for (const freskId of state.freskIds) {
                allModifiedFiles = allModifiedFiles.concat(state.listModifiedFreskFiles(freskId));
            }
            return allModifiedFiles;
        },
    },
    actions: {
        async fetchFresks() {
            if (Object.keys(this._fresks).length > 0) return;
            this.loading = true;

            const tree = await useGitlabStore().listFiles('_fresks', 1, true);
            for (const freskFilename in tree['_fresks']) {
                if (freskFilename === '.gitkeep') continue;
                const freskId = freskFilename.slice(0, freskFilename.length - 5);
                if (!this._modifications[freskId]) this._modifications[freskId] = {};

                this._fresks[freskId] = {
                    id: freskId,
                    edges: {},
                    nodes: {},
                    background: [],
                    title: {},
                    version: undefined,
                    lot: '',
                    variants: [],
                };
                await this.fetchFresk(freskId, true);
            }

            if (tree['_fresks'] !== undefined) {
                // Remove removed/moved fresks from the list (see #171)
                const treeFreskIds = new Set(Object.keys(tree['_fresks']).map((freskFilename) => freskFilename.slice(0, -5)));

                for (const freskId of this.freskIds) {
                    if (this.isNew(freskId)) continue;
                    if (treeFreskIds.has(freskId)) continue;
                    if (Object.keys(this._modifications[freskId]).length > 0) {
                        console.warn(`You had modification for fresk ${freskId} but it has been removed or moved.`);
                    }
                    delete this._modifications[freskId];
                }
            }

            setTimeout(() => (this.loading = false), 0);
        },
        async fetchAllModifiedFresks() {
            await this.fetchFresks();
            const promises = [];
            for (const freskId in this._fresks) {
                if (!this.changed(freskId)) continue;
                promises.push(this.fetchFresk(freskId));
            }
            await Promise.all(promises);
        },
        async fetchFresk(freskId, onlyCache) {
            if (this.isNew(freskId)) return;

            await this.fetchFresks();
            const fresk = this._fresks[freskId];
            if (fresk === undefined) return;
            // TODO
            const freskData = await useGitlabStore().requestFile(`_fresks/${freskId}.json`, onlyCache !== undefined ? 2 : 1);
            if (freskData === undefined) return undefined;

            if (!validateFresk(freskData)) {
                console.error(`Not valid fresk ${freskId}`);
                console.error(validateFresk.errors);
                return undefined;
            }

            // Nodes and edges are a list of values.
            // Replace it by a indexed by id dictionnary
            this._fresks[freskId]['nodes'] = freskData['nodes'].reduce((acc, v) => ({ ...acc, [v.cardId]: v }), {});

            // TODO: put in only one place the "link id logic"
            this._fresks[freskId]['edges'] = freskData['edges'].reduce((acc, v) => ({ ...acc, [v.from + '_' + v.to]: v }), {});

            this._fresks[freskId]['title'] = freskData['title'];
            this._fresks[freskId]['version'] = freskData['version'];

            this._fresks[freskId]['lot'] = freskData['lot'];
            this._fresks[freskId]['variants'] = freskData['variants'];

            if (freskData['background'] !== undefined) this._fresks[freskId]['background'] = freskData['background'];

            this._fresks[freskId].commit = useGitlabStore().getLastCommit();

            // Remove already applied modifications
            const modifications = this.freskModifications(freskId);
            for (const k in modifications) {
                const modif = modifications[k];

                if (
                    modif['newValue'] == modif['oldValue'] ||
                    (modif['newValue']['removed'] !== undefined && modif['newValue']['removed'] && modif['oldValue'] === undefined)
                )
                    this.setModification(freskId, modif['i18n'], modif['field'], undefined);
            }
        },
        // Subfield is the id of the edsge, node, etc.
        setModification(freskId, subfield, field, subsubField, value) {
            if (subsubField !== undefined) {
                value = { ...this.fresk(freskId)[field][subfield].value, [subsubField]: value };
            }
            setModification(this._fresks, this._modifications, freskId, subfield, field, value);
        },
        clearModifications() {
            this._modifications = {};
            for (const freskId in this._fresks) {
                this._modifications[freskId] = {};
            }
        },
        resetFresks() {
            delete this._fresks;
            this._fresks = {};
        },
        isNew(freskId) {
            return freskId[0] === '_';
        },
        async createFresk() {
            const freskId = '_' + generateUuid8();
            const fresk = {
                id: freskId.slice(1), // TODO?
                edges: {},
                nodes: {},
                background: [],
                title: {},
                version: '1.7.0', //TODO
                lot: '',
                variants: [],
            };
            this._modifications[freskId] = fresk;
            return freskId;
        },
    },
});

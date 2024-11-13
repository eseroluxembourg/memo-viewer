'use strict';

import { defineStore } from 'pinia';
import matter from 'gray-matter';

import { useSettingsStore } from '@/store/settings';
import { useVariantsStore } from '@/store/variants';
import { useGitlabStore } from '@/store/gitlab';
import { useStorage } from '@vueuse/core';
import { objectWithAppliedModifications, listModifications, computeActiveLangs, setModification, generateGitlabActions } from '@/utils/modifications';
import { previousElement, nextElement, generateUuid8 } from '@/utils/utils';
import { findBestAvailableLang } from '!/src/utils/i18n.js';

export const useCardsStore = defineStore('cards', {
    state: () => {
        const settings = useSettingsStore();
        return {
            _cards: {},
            _modifications: useStorage(`${settings.repo}/cards/modifications`, {}, localStorage),
            loading: false,
            loadingCard: false,
            _langs: useStorage(`${settings.repo}/cards/langs`, [], localStorage),
        };
    },
    getters: {
        cardImage: () => {
            return (cardId, i18n, variant, side) => {
                const ext = side === 'front' ? 'jpg' : 'png';
                return `${useSettingsStore().host}/cards/${variant}/${i18n}/default/${cardId}-${side}.${ext}`;
            };
        },
        cardIds: (state) => {
            return Object.keys(state._modifications);
        },
        previousCardId: (state) => {
            return (cardId) => {
                return previousElement(state.cardIds, cardId);
            };
        },
        nextCardId: (state) => {
            return (cardId) => {
                return nextElement(state.cardIds, cardId);
            };
        },
        langs: (state) => {
            return state._langs;
        },
        cards: (state) => {
            return state._cards;
        },
        changed: (state) => {
            return (cardId) => {
                return state.cardModifications(cardId).length > 0;
            };
        },
        hasModifications: (state) => {
            for (const cardId of state.cardIds) {
                if (state.changed(cardId)) {
                    return true;
                }
            }
            return false;
        },
        flatModifications: (state) => {
            let allModifications = [];
            for (const cardId of state.cardIds) {
                allModifications = allModifications.concat(state.cardModifications(cardId));
            }
            return allModifications;
        },
        cardModifications: (state) => {
            return (cardId) => {
                return listModifications(cardId, state._cards[cardId], state._modifications[cardId]);
            };
        },
        listModifiedCardFiles: (state) => {
            return (cardId) => {
                const files = generateGitlabActions(
                    state.card(cardId),
                    state.isNew(cardId),
                    (id) => `_cards/${id}/index.md`,
                    (id, i18n) => `_cards/${id}/${i18n}/index.md`,
                    'cardContent',
                    ['backDescription', 'title', 'wikiUrl', 'youtubeCode', 'instagramCode'],
                    state.existingLangs(cardId),
                    cardId,
                    ['num', 'lot', 'variants', 'isFrontOnly'],
                );
                return files;
            };
        },
        allModifiedFiles: (state) => {
            let allModifiedFiles = [];
            for (const cardId of state.cardIds) {
                if (!state.changed(cardId)) continue;
                allModifiedFiles = allModifiedFiles.concat(state.listModifiedCardFiles(cardId));
            }
            return allModifiedFiles;
        },
        card: (state) => {
            return (cardId) => {
                const result = objectWithAppliedModifications(state._cards[cardId], state._modifications[cardId]);
                result.langs = computeActiveLangs(result);
                // Not very robust
                result.fetched =
                    state.isNew(cardId) || (state._cards[cardId] !== undefined && state._cards[cardId].commit === useGitlabStore().getLastCommit());
                return result;
            };
        },
        existingLangs: (state) => {
            return (cardId) => {
                if (state.isNew(cardId)) return new Set();
                return state._cards[cardId].existingLangs;
            };
        },
        lots: (state) => {
            const _lots = new Set();
            for (const cardId of state.cardIds) {
                if (state.card(cardId)['lot'] == undefined) continue;
                _lots.add(state.card(cardId)['lot'].value);
            }
            return _lots;
        },
        cardTitleForDisplay: (state) => {
            return (cardId, i18n) => {
                const card = state.card(cardId);
                if (card.title === undefined) return '?';
                const bestLang = findBestAvailableLang(i18n, Object.keys(card.title));
                if (bestLang == undefined) return '?';
                return card.title[bestLang].value;
            };
        },
        cardVariantForDisplay: (state) => {
            return (cardId, i18n) => {
                const card = state.card(cardId);
                if (card.variants === undefined || card.variants.value.length === 0) return undefined;
                const variantsStore = useVariantsStore();
                return variantsStore.bestVariantAmong(card.variants.value, i18n);
            };
        },
    },
    actions: {
        async fetchCards() {
            if (Object.keys(this._cards).length > 0) return;
            this.loading = true;

            const tree = await useGitlabStore().listFiles('_cards', 1, true);
            const promises = [];
            for (const cardId in tree['_cards']) {
                if (cardId === '.gitkeep') continue;
                if (!this._modifications[cardId]) this._modifications[cardId] = {};
                const langs = new Set(Object.keys(tree['_cards'][cardId]));
                langs.delete('index.md');

                for (const lang of langs) {
                    if (this._langs.includes(lang)) continue;
                    this._langs.push(lang);
                }

                this._cards[cardId] = {
                    id: cardId,
                    existingLangs: langs,
                    num: undefined,
                    lot: undefined,
                    isFrontOnly: false,
                    variants: [],
                    wikiUrl: {},
                    youtubeCode: {},
                    instagramCode: {},
                    title: {},
                    cardContent: {}, // TODO: should be explanations
                    backDescription: {},
                    commit: undefined,
                };
                promises.push(this.fetchCard(cardId, true));
            }
            await Promise.all(promises);

            // Remove removed/moved cards from the list (see #171)
            if (tree['_cards'] !== undefined) {
                const treeCardsIds = new Set(Object.keys(tree['_cards']));
                for (const cardId of this.cardIds) {
                    if (this.isNew(cardId)) continue;
                    if (treeCardsIds.has(cardId)) continue;
                    if (Object.keys(this._modifications[cardId]).length > 0) {
                        console.warn(`You had modification for card ${cardId} but it has been removed or moved.`);
                    }
                    delete this._modifications[cardId];
                }
            }

            setTimeout(() => (this.loading = false), 0);
        },
        async prefetchCard(cardId, onlyCache) {
            await this.fetchCards();
            const card = this._cards[cardId];
            if (card === undefined) return;
            const defaultLang = findBestAvailableLang(undefined, Array.from(card.existingLangs));
            const promises = [];
            promises.push(this.fetchCardLangData(cardId, defaultLang, onlyCache));
            promises.push(this.fetchCardCommonData(cardId, onlyCache));
        },
        async fetchCard(cardId, onlyCache) {
            if (this.isNew(cardId)) {
                this._modifications[cardId] = {
                    id: cardId,
                    num: '1',
                    lot: '1',
                    variants: [],
                    removed: false,
                    existingLangs: [],
                    wikiUrl: {},
                    youtubeCode: {},
                    instagramCode: {},
                    title: {},
                    cardContent: {}, // TODO: should be explanations
                    backDescription: {},
                    ...this._modifications[cardId],
                };

                return;
            }
            await this.fetchCards();
            const card = this._cards[cardId];
            if (card === undefined) return;

            this.loadingCard = true;
            const promises = [this.fetchCardCommonData(cardId, onlyCache)];

            for (const lang of card.existingLangs) {
                promises.push(this.fetchCardLangData(cardId, lang, onlyCache));
            }
            await Promise.all(promises);

            // Remove already applied modifications
            const modifications = this.cardModifications(cardId);
            for (const k in modifications) {
                const modif = modifications[k];
                if (modif['newValue'] === modif['oldValue']) this.setModification(cardId, modif['i18n'], modif['field'], undefined);
            }
            setTimeout(() => (this.loadingCard = false), 0);
        },
        async fetchAllModifiedCards() {
            await this.fetchCards();
            const promises = [];
            for (const cardId in this._cards) {
                if (!this.changed(cardId)) continue;
                promises.push(this.fetchCard(cardId));
            }
            await Promise.all(promises);
        },
        async fetchCardCommonData(cardId, onlyCache) {
            if (this._cards[cardId]['num'] !== undefined) return;

            const file = await useGitlabStore().requestFile(`_cards/${cardId}/index.md`, onlyCache !== undefined ? 2 : 1);
            if (file === undefined) return undefined;

            const parsedMd = matter(file);
            this._cards[cardId]['id'] = cardId;
            this._cards[cardId]['lot'] = parsedMd.data['lot'];
            this._cards[cardId]['num'] = parsedMd.data['num'];

            if ('isFrontOnly' in parsedMd.data) {
                this._cards[cardId]['isFrontOnly'] = parsedMd.data['isFrontOnly'];
            }
            this._cards[cardId]['variants'] = parsedMd.data['variants'];
            this._cards[cardId].commit = useGitlabStore().getLastCommit();
        },
        async fetchCardLangData(cardId, i18n, onlyCache) {
            if (this._cards[cardId]['cardContent'][i18n]) return;

            const file = await useGitlabStore().requestFile(`_cards/${cardId}/${i18n}/index.md`, onlyCache !== undefined ? 2 : 1);
            if (file === undefined) return undefined;

            const parsedMd = matter(file);

            this._cards[cardId]['cardContent'][i18n] = parsedMd.content;
            this._cards[cardId]['title'][i18n] = parsedMd.data.title;
            this._cards[cardId]['backDescription'][i18n] = parsedMd.data.backDescription;

            if (parsedMd.data['youtubeCode']) this._cards[cardId]['youtubeCode'][i18n] = parsedMd.data['youtubeCode'];
            if (parsedMd.data['instagramCode']) this._cards[cardId]['instagramCode'][i18n] = parsedMd.data['instagramCode'];
            if (parsedMd.data['wikiUrl']) this._cards[cardId]['wikiUrl'][i18n] = parsedMd.data['wikiUrl'];

            this._cards[cardId].commit = useGitlabStore().getLastCommit();
        },
        setModification(cardId, i18n, field, value) {
            setModification(this._cards, this._modifications, cardId, i18n, field, value);
        },
        checkValidity(cardId) {
            const result = { valid: true, messages: [] };

            // Currently only check url
            //eslint-disable-next-line
            const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

            const card = this.card(cardId);

            if (card.wikiUrl !== undefined) {
                for (const i18n of Object.keys(card.wikiUrl)) {
                    const v = card.wikiUrl[i18n].value;
                    if (!urlRegex.test(v)) {
                        result.valid = false;
                        result.messages.push(`Wiki url for card ${cardId} in lang ${i18n} ("${v}") is not a valid url`);
                    }
                }
            }
            return result;
        },
        checkValidityForAll() {
            const result = { valid: true, messages: [] };
            for (const cardId of this.cardIds) {
                if (!this.changed(cardId)) continue;
                const validity = this.checkValidity(cardId);
                if (validity.valid) continue;
                result.valid = false;
                result.messages = result.messages.concat(validity.messages);
            }
            return result;
        },
        clearModifications() {
            this._modifications = {};
            for (const cardId in this._cards) {
                this._modifications[cardId] = {};
            }
        },
        resetCards() {
            delete this._cards;
            this._cards = {};
        },
        isNew(cardId) {
            return cardId[0] === '_';
        },
        async createCard() {
            const cardsStore = useCardsStore();
            await cardsStore.fetchCards();

            const cardId = '_' + generateUuid8();
            const card = {
                id: cardId.slice(1),
                num: '1',
                lot: '1',
                variants: [],
                removed: false,
                existingLangs: ['fr-FR'],
                wikiUrl: {},
                youtubeCode: {},
                instagramCode: {},
                title: {},
                cardContent: {}, // TODO: should be explanations
                backDescription: {},
                isFrontOnly: false,
            };
            this._modifications[cardId] = card;
            return cardId;
        },
    },
});

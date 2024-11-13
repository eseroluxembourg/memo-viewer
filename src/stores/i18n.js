import { defineStore } from 'pinia';

import.meta.glob(`/src/assets/_pages/*/*.md`);

import pages from '@/data/pages.json';
import assets from '@/data/assets.json';
import settings from '@/../settings.json';

import { findBestAvailableLang } from '@/utils/i18n';

export const useI18nStore = defineStore('i18nStore', {
    state: () => {
        return {
            pageContent: {},
            pages,
            assets,
            settings,
        };
    },

    getters: {
        page: (state) => {
            return (pageId, i18n) => {
                const bestLang = findBestAvailableLang(i18n, pages[pageId]);
                if (!state.pageContent[pageId + '/' + bestLang]) return undefined;
                return state.pageContent[pageId + '/' + bestLang];
            };
        },

        label: (state) => {
            return (label, i18n) => {
                const bestLang = findBestAvailableLang(i18n, Object.keys(state.settings[label]));
                return state.settings[label][bestLang];
            };
        },
        asset: (state) => {
            return (assetId, i18n) => {
                const bestLang = findBestAvailableLang(i18n, Object.keys(state.assets[assetId]));
                const asset = state.assets[assetId];
                return asset[bestLang];
            };
        },
    },

    actions: {
        async fetchPage(pageId, i18n) {
            const bestLang = findBestAvailableLang(i18n, this.pages[pageId]);
            const { html, attributes } = await import(`@/assets/_pages/${pageId}/${bestLang}.md`);
            this.pageContent[pageId + '/' + bestLang] = { html, attributes };
        },
    },
});

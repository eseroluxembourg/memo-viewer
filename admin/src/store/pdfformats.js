'use strict';

import { defineStore } from 'pinia';

import { useSettingsStore } from '@/store/settings';
import { useGitlabStore } from '@/store/gitlab';
import { useStorage } from '@vueuse/core';
import { objectWithAppliedModifications, setModification, listModifications } from '@/utils/modifications';

export const usePdfFormatsStore = defineStore('pdfFormats', {
    state: () => {
        const settings = useSettingsStore();
        return {
            _pdfFormats: {},
            _modifications: useStorage(`${settings.repo}/pdfFormats/modifications`, {}, localStorage),
            loading: false,
            loadingPdfFormat: false,
        };
    },
    getters: {
        pdfFormatIds: (state) => {
            return Object.keys(state._modifications);
        },
        pdfFormat: (state) => {
            // TODO modificatons
            return (pdfFormatId) => {
                const result = objectWithAppliedModifications(state._pdfFormats[pdfFormatId], state._modifications[pdfFormatId]);
                return result;
            };
        },
        listOptions: (state) => {
            return (pdfFormatId) => {
                const options = new Set();
                const pdfFormat = state.pdfFormat(pdfFormatId);
                for (const index in pdfFormat) {
                    options.add(JSON.stringify(pdfFormat[index].options.value));
                }
                return options;
            };
        },
        changed: (state) => {
            return (pdfFormatId) => {
                return state.pdfFormatModifications(pdfFormatId).length > 0;
            };
        },
        hasModifications: (state) => {
            for (const pdfFormatId of state.pdfFormatIds) {
                if (state.changed(pdfFormatId)) {
                    return true;
                }
            }
            return false;
        },
        flatModifications: (state) => {
            let allModifications = [];
            for (const pdfFormatId of state.pdfFormatIds) {
                allModifications = allModifications.concat(state.pdfFormatModifications(pdfFormatId));
            }
            return allModifications;
        },
        pdfFormatModifications: (state) => {
            return (pdfFormatId) => {
                return listModifications(pdfFormatId, state._pdfFormats[pdfFormatId], state._modifications[pdfFormatId]);
            };
        },
        allModifiedFiles: (state) => {
            const allModifiedFiles = [];
            for (const pdfFormatId in state._pdfFormats) {
                if (!state.changed(pdfFormatId)) continue;
                if (state._pdfFormats[pdfFormatId] === undefined) continue;

                // TODO avoid non fetched
                const pdfFormatData = [];
                const pdfFormat = state.pdfFormat(pdfFormatId);
                for (const k in pdfFormat) {
                    const el = pdfFormat[k];
                    if (Object.keys(el).length == 0) continue;

                    pdfFormatData.push({
                        pdfpage: el.pdfpage.value,
                        cardid: el.cardid.value,
                        side: el.side.value,
                        options: el.options.value,
                    });
                }

                allModifiedFiles.push({
                    action: 'update',
                    file_path: `moulinette-data/${pdfFormatId}`,
                    previous_path: `moulinette-data/${pdfFormatId}`,
                    content: JSON.stringify(pdfFormatData, null, 4),
                });
            }
            return allModifiedFiles;
        },
    },
    actions: {
        async fetchPdfFormats() {
            if (Object.keys(this._pdfFormats).length > 0) return;
            this.loading = true;
            this._pdfFormats = {};

            const moulinetteDataFiles = await useGitlabStore().listFiles('moulinette-data', 1, false);
            for (let file of moulinetteDataFiles) {
                file = file.slice('moulinette-data/'.length);
                if (!file.startsWith('pdfformat')) continue;
                if (!this._modifications[file]) this._modifications[file] = {};

                this._pdfFormats[file] = [];
            }

            setTimeout(() => (this.loading = false), 0);
        },
        async fetchPdfFormat(pdfFormatId, onlyCache) {
            await this.fetchPdfFormats();

            const pdfFormat = this._pdfFormats[pdfFormatId];
            if (pdfFormat === undefined) return;

            this.loadingPdfFormat = true;
            this._pdfFormats[pdfFormatId] = await useGitlabStore().requestFile(`moulinette-data/${pdfFormatId}`, onlyCache !== undefined ? 2 : 1);

            setTimeout(() => (this.loadingPdfFormat = false), 0);
        },
        setModification(pdfFormatId, elementIndex, field, value) {
            setModification(this._pdfFormats, this._modifications, pdfFormatId, field, elementIndex, value);
        },
        clearModifications() {
            this._modifications = {};
            for (const pdfFormatId in this._variants) {
                this._modifications[pdfFormatId] = {};
            }
        },
        isNew() {
            return false;
        },
    },
});

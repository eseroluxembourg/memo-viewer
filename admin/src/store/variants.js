'use strict';

import { defineStore } from 'pinia';

import { useSettingsStore } from '@/store/settings';
import { useGitlabStore } from '@/store/gitlab';
import { useStorage } from '@vueuse/core';
import { objectWithAppliedModifications, setModification, listModifications } from '@/utils/modifications';

const PALETTE = ['#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E', '#577590', '#277DA1'];

export const useVariantsStore = defineStore('variants', {
    state: () => {
        const settings = useSettingsStore();
        return {
            _variants: {},
            _pdfFormats: [],
            _pdfReplacements: [],
            _modifications: useStorage(`${settings.repo}/variants/modifications`, {}, localStorage),
            loading: false,
        };
    },
    getters: {
        variantIds: (state) => {
            return Object.keys(state._modifications);
        },
        variant: (state) => {
            // TODO modificatons
            return (variantId) => {
                const result = objectWithAppliedModifications(state._variants[variantId], state._modifications[variantId]);
                return result;
            };
        },
        changed: (state) => {
            return (variantId) => {
                return state.variantModifications(variantId).length > 0;
            };
        },
        pdfFormats: (state) => {
            return state._pdfFormats;
        },
        pdfReplacements: (state) => {
            return state._pdfReplacements;
        },
        defaultVariant: (state) => {
            if (Object.keys(state._variants).length === 0) return undefined;

            for (const variantId of state.variantIds) {
                if (state.variant(variantId).default.value) return variantId;
            }
            console.warn('No default variant found');
            return state.variantIds[0];
        },
        hasModifications: (state) => {
            for (const variantId of state.variantIds) {
                if (state.changed(variantId)) {
                    return true;
                }
            }
            return false;
        },
        flatModifications: (state) => {
            let allModifications = [];
            for (const variantId of state.variantIds) {
                allModifications = allModifications.concat(state.variantModifications(variantId));
            }
            return allModifications;
        },
        variantModifications: (state) => {
            return (variantId) => {
                return listModifications(variantId, state._variants[variantId], state._modifications[variantId]);
            };
        },
    },
    actions: {
        async fetchVariants() {
            if (Object.keys(this._variants).length > 0) return;
            this.loading = true;
            this._pdfFormats = [];
            this._pdfReplacements = [];

            this._variants = await useGitlabStore().requestFile('variants.json', true);
            let k = 0;
            for (const variantId in this._variants) {
                this._variants[variantId].id = variantId;

                this._variants[variantId].color = PALETTE[k];
                k += 1;
                if (k >= PALETTE.length) k = 0;

                if (!this._modifications[variantId]) this._modifications[variantId] = {};
            }

            // TODO: use pdfformatsstore here
            const moulinetteDataFiles = await useGitlabStore().listFiles('moulinette-data', 1, false);
            moulinetteDataFiles.map((file) => {
                file = file.slice('moulinette-data/'.length);
                if (file.startsWith('pdfformat')) this._pdfFormats.push(file);
                else if (file.startsWith('replacements')) this._pdfReplacements.push(file);
            });

            setTimeout(() => (this.loading = false), 0);
        },
        setModification(variantId, subfield, field, subsubField, value) {
            if (subsubField !== undefined) {
                const variant = this.variant(variantId);
                if (variant[field][subfield] !== undefined) {
                    value = { ...this.variant(variantId)[field][subfield].value, [subsubField]: value };
                } else {
                    value = { ...{ url: '', format: '', replacements: '' }, [subsubField]: value };
                }
            }

            setModification(this._variants, this._modifications, variantId, subfield, field, value);
        },
        clearModifications() {
            this._modifications = {};
            for (const variantId in this._variants) {
                this._modifications[variantId] = {};
            }
        },
        isNew() {
            return false;
        },
        bestVariantAmong(variantIds, i18n) {
            // Todo: improve me, last case
            if (variantIds.length === 0) return undefined;

            for (const variantId of variantIds) {
                const variant = this.variant(variantId);
                if (variant.langs[i18n] === undefined) continue;
                if (variant.default.value) return variantId;
            }

            for (const variantId of variantIds) {
                const variant = this.variant(variantId);
                if (variant.langs[i18n] === undefined) continue;
                return variantId;
            }
            return variantIds[0];
        },
    },
});

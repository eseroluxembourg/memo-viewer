import { defineStore } from 'pinia';

import { useCardsStore } from '@/stores/cards.js';

import.meta.glob(`/src/assets/_fresks/*.json`);

import fresks from '@/data/fresks.json';
import linksStyle from '@/assets/_links/linksStyle.json';

import { findBestAvailableLang } from '@/utils/i18n';
import { applyEdgeStyle } from '../components/fresk/utils';

export const useFreskStore = defineStore('fresks', {
    state: () => {
        return {
            fresks: Object.fromEntries(fresks.map((fresk) => [fresk.id, fresk])),
            freskData: {},
        };
    },
    getters: {
        isValidFresk: (state) => {
            return (freskId) => state.fresks[freskId] !== undefined;
        },
        title: (state) => {
            return (freskId, i18n) => {
                if (!state.isValidFresk(freskId)) return '';
                const titles = state.fresks[freskId].title;
                const bestLang = findBestAvailableLang(i18n, Object.keys(titles));
                return titles[bestLang];
            };
        },
        data: (state) => {
            return (freskId) => {
                if (!state.isValidFresk(freskId) || !state.freskData[freskId])
                    return { nodes: [], edges: [], background: [], version: '', title: '' };
                return state.freskData[freskId];
            };
        },
        availableFresks: (state) => {
            return (lot, variant) => {
                return Object.keys(state.fresks).filter(
                    (freskId) => state.fresks[freskId].lot === lot && state.fresks[freskId].variants.includes(variant),
                );
            };
        },
        usedLinksStyle: (state) => {
            return (freskId) => {
                const classStyles = new Array(...new Set([].concat(...state.data(freskId).edges.map((edge) => edge.class))));
                classStyles.sort((a, b) => a.$label - b.$label);
                return classStyles;
            };
        },
    },
    actions: {
        async fetchFresk(freskId) {
            if (this.freskData[freskId]) return this.freskData[freskId];
            const cardStores = useCardsStore();
            const fresk = await import(`@/assets/_fresks/${freskId}.json`);
            this.freskData[freskId] = fresk;

            this.freskData[freskId].edges.forEach((element, index) => {
                this.freskData[freskId].edges[index] = applyEdgeStyle(element, []);
            });

            // Todo overidden edges
            // ??
            for (const node of fresk.nodes) {
                for (const linkId of cardStores.linksFrom(node.cardId)) {
                    const link = cardStores.link(linkId);
                    if (link.status !== 'valid') continue;

                    const linkClasses = [link.status];

                    if (link.class != undefined) {
                        if (typeof link.class == 'string') {
                            linkClasses.push(link.class);
                        } else {
                            linkClasses.push(...link.class);
                        }
                    }

                    this.freskData[freskId].edges.push(
                        applyEdgeStyle(
                            {
                                from: link.fromCardId,
                                to: link.toCardId,
                                status: link.status,
                            },
                            linkClasses.map((cls) => linksStyle[cls]).filter((x) => x != undefined),
                        ),
                    );
                }
            }
        },
    },
});

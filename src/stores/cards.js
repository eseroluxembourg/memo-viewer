import { defineStore } from 'pinia';

import.meta.glob(`/src/assets/_cards/*/*.md`);
import.meta.glob(`/src/assets/_links/*/*.md`);

import cards from '@/data/cards.json';
import links from '@/data/links.json';

import settings from '@/../settings.json';
import variants from '@/../variants.json';

import { DEFAULT_FALLBACK_LOCALE, findBestAvailableLang } from '@/utils/i18n';

import { isBefore, isStrictlyBefore } from '@/utils/cardsordering';

export const useCardsStore = defineStore('cards', {
    state: () => {
        return {
            cards: Object.fromEntries(cards.map((card) => [card.id, card])),
            links: Object.fromEntries(links.map((link) => [link.id, link])),
            cardAttributes: {},
            cardHtml: {},
            linkContent: {},
            svgs: { front: {}, back: {} },
        };
    },
    getters: {
        num: (state) => {
            return (cardId) => {
                return state.cards[cardId].num;
            };
        },
        variants: (state) => {
            return (cardId) => {
                return state.cards[cardId].variants;
            };
        },
        isFrontOnly: (state) => {
            return (cardId) => {
                return state.cards[cardId].isFrontOnly;
            };
        },

        exists: (state) => {
            return (cardId, variant) => {
                return !!state.cards[cardId] && (!variant || state.cards[cardId].variants.includes(variant));
            };
        },
        firstCardId: (state) => {
            let firstCardId = undefined;
            let firstCardNum = -1;

            for (const cardId in state.cards) {
                const c = state.cards[cardId];
                if (firstCardId === undefined || c.num < firstCardNum) {
                    firstCardId = cardId;
                    firstCardNum = c.num;
                }
            }
            return firstCardId;
        },
        previousId: (state) => {
            return (cardId, variant) => {
                const card = state.cards[cardId];

                let previousCardId = undefined;
                let previousCardNum = -1;

                for (const cid in state.cards) {
                    const c = state.cards[cid];
                    if (cid === cardId) continue;
                    if (!c.variants.includes(variant)) continue;

                    if (isBefore(card.num, c.num)) continue;
                    if (previousCardId === undefined || isStrictlyBefore(previousCardNum, c.num)) {
                        previousCardId = cid;
                        previousCardNum = c.num;
                    }
                }
                return previousCardId;
            };
        },
        nextId: (state) => {
            return (cardId, variant) => {
                const card = state.cards[cardId];

                let nextCardId = undefined;
                let nextCardNum = -1;

                for (const cid in state.cards) {
                    const c = state.cards[cid];
                    if (cid === cardId) continue;
                    if (!c.variants.includes(variant)) continue;

                    if (isBefore(c.num, card.num)) {
                        continue;
                    }
                    if (nextCardId === undefined || isBefore(c.num, nextCardNum)) {
                        nextCardId = cid;
                        nextCardNum = c.num;
                    }
                }
                return nextCardId;
            };
        },
        cardFileSourceUrl: () => {
            return (cardId, i18n) => {
                return `${settings.gitlab.base_url}/${settings.gitlab.repo}/-/edit/main/_cards/${cardId}/${i18n}/index.md`;
            };
        },
        htmlLanguage: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].content;
                if (langs.length === 0) return undefined;
                return findBestAvailableLang(i18n, langs);
            };
        },
        html: (state) => {
            return (cardId, i18n) => {
                const bestLang = state.htmlLanguage(cardId, i18n);
                if (!state.cardHtml[cardId + '/' + bestLang]) return '';
                return state.cardHtml[cardId + '/' + bestLang];
            };
        },
        title: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].title;
            };
        },
        backDescription: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].backDescription;
            };
        },
        youtubeCode: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].youtubeCode;
                if (langs.length === 0) return undefined;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].youtubeCode;
            };
        },
        wikiUrl: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].wikiUrl;
                if (langs.length === 0) return undefined;

                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].wikiUrl;
            };
        },
        instagramCode: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].instagramCode;
                if (langs.length === 0) return '';
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].instagramCode;
            };
        },
        image: () => {
            return (cardId, targetI18n, category, variant, side) => {
                const i18n = findBestAvailableLang(targetI18n, Object.keys(variants[variant].langs));
                console.assert(side === 'front' || side === 'back');
                if (category === 'default') {
                    const ext = side === 'front' ? 'jpg' : 'png';
                    //eslint-disable-next-line
                    return `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/default/${cardId}-${side}.${ext}`;
                } else if (category === 'svg') {
                    //eslint-disable-next-line
                    return `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/svg/${cardId}-${side}.svg`;
                } else if (category === 'webset') {
                    const imgSizes = [125, 250, 450, 600];

                    const srcSet = imgSizes
                        //eslint-disable-next-line
                        .map((size) => `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/${size}/${cardId}-${side}.webp ${size}w,`)
                        .join();

                    return srcSet;
                }
            };
        },
        cardSvg: (state) => {
            // No lang fallback for images
            return (cardId, i18n, variant, side) => {
                return state.svgs[side][cardId + '/' + i18n + '/' + variant];
            };
        },
        cardsInLots: (state) => {
            return (lots, variant) => {
                const res = Object.values(state.cards)
                    .filter((card) => card.variants.includes(variant))
                    .filter((card) => lots.includes(card.lot))
                    .sort((a, b) => (isBefore(a.num, b.num) ? -1 : 1))
                    .map((card) => card.id);
                return res;
            };
        },
        lots: (state) => {
            const res = Array.from(new Set(Object.values(state.cards).map((card) => card.lot)));
            res.sort();
            return res;
        },
        linksFrom: (state) => {
            return (fromCardId, status, variant) =>
                Object.keys(state.links).filter(
                    (linkId) =>
                        state.links[linkId].fromCardId == fromCardId &&
                        (status === undefined || state.links[linkId].status === status) &&
                        (variant === undefined || state.cards[state.links[linkId].toCardId].variants.includes(variant)),
                );
        },
        linksTo: (state) => {
            return (toCardId, status, variant) =>
                Object.keys(state.links).filter(
                    (linkId) =>
                        state.links[linkId].toCardId == toCardId &&
                        (status === undefined || state.links[linkId].status === status) &&
                        (variant === undefined || state.cards[state.links[linkId].fromCardId].variants.includes(variant)),
                );
        },
        link: (state) => {
            return (linkId) => state.links[linkId];
        },
        linkHtml: (state) => {
            return (linkId, i18n) => {
                const langs = state.links[linkId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.linkContent[linkId + '/' + bestLang]) return '';
                return state.linkContent[linkId + '/' + bestLang].html;
            };
        },
        spaceTitle: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].spaceTitle;
            };
        },
        spaceText: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].spaceText;
            };
        },
        spaceUrl: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].spaceUrl;
            };
        },
        spaceYoutubeCode: (state) => {
            return (cardId, i18n) => {
                const langs = state.cards[cardId].langs;
                if (langs.length === 0) return undefined;
                const bestLang = findBestAvailableLang(i18n, langs);
                if (!state.cardAttributes[cardId + '/' + bestLang]) return '';
                return state.cardAttributes[cardId + '/' + bestLang].spaceYoutubeCode;
            };
        },
        cardSvgSpaceArea: (state) => {
            // No lang fallback for images
            return (cardId, i18n, variant, side) => {
                return state.svgs[side][cardId + '/' + i18n + '/spacearea/' + variant];
            };
        },
        imageSpaceArea: () => {
            return (cardId, i18n, variant) => {
                return `/local/spacearea/${variant}/${cardId}/${i18n}.png`;
            };
            // return (cardId, targetI18n, category, variant, side) => {
            //     const i18n = findBestAvailableLang(targetI18n, Object.keys(variants[variant].langs));
            //     console.assert(side === 'front' || side === 'back');
            //     if (category === 'default') {
            //         // TODO: implement const ext = side === 'front' ? 'jpg' : 'png';
            //         const ext = "png";
            //         //eslint-disable-next-line
            //         //return `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/spacearea/default/${cardId}-${side}.${ext}`;
            //         return `/local/spacearea/${variant}/${cardId}/${i18n}.${ext}`;
            //     } else if (category === 'svg') {
            //         //eslint-disable-next-line
            //         // return `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/spacearea/svg/${cardId}-${side}.svg`;
            //         return `/local/spacearea/${variant}/${cardId}/${i18n}.svg`;
            //     } else if (category === 'webset') {
            //         const imgSizes = [125, 250, 450, 600];

            //         const srcSet = imgSizes
            //             //eslint-disable-next-line
            //             //.map((size) => `${__CARDS_URL_PREFIX__}/cards/${variant}/${i18n}/spacearea/${size}/${cardId}-${side}.webp ${size}w,`)
            //             .map((size) => `/local/spacearea/${variant}/${cardId}/${i18n}.webp ${size}w,`)
            //             .join();

            //         return srcSet;
            //     }
            // };
        },
    },
    actions: {
        async fetchEverythingForCard(cardId, i18n, variant) {
            const promises = [
                this.fetchCardAttributes(cardId, i18n),
                this.fetchCardAttributes(cardId, DEFAULT_FALLBACK_LOCALE),
                this.fetchCardHtml(cardId, i18n),
                this.fetchCardsLinks(cardId, i18n),
                this.fetchCardSvg(cardId, i18n, variant, 'front'),
                this.fetchCardSvg(cardId, i18n, variant, 'back'),
                this.fetchNeighborsAttributes(cardId, i18n, variant),
            ];
            await Promise.all(promises);
        },
        async fetchNeighborsAttributes(cardId, i18n, variant) {
            const promises = [
                this.fetchCardAttributes(this.previousId(cardId, variant), i18n),
                this.fetchCardAttributes(this.previousId(cardId, variant), DEFAULT_FALLBACK_LOCALE),
                this.fetchCardAttributes(this.nextId(cardId, variant), i18n),
                this.fetchCardAttributes(this.nextId(cardId, variant), DEFAULT_FALLBACK_LOCALE),
            ];
            await Promise.all(promises);
        },
        async fetchCardAttributes(cardId, i18n) {
            if (cardId === undefined) return;
            const langs = this.cards[cardId].langs;
            const bestLang = findBestAvailableLang(i18n, langs);
            if (bestLang === undefined) return;
            if (this.cardAttributes[cardId + '/' + bestLang]) return this.cardAttributes[cardId + '/' + bestLang];
            const { attributes } = await import(`@/assets/_cards/${cardId}/${bestLang}/index.md`);
            this.cardAttributes[cardId + '/' + bestLang] = attributes;
        },
        async fetchCardHtml(cardId, i18n) {
            const langs = this.cards[cardId].content;
            if (langs.length === 0) return;

            const bestLang = findBestAvailableLang(i18n, langs);

            if (this.cardHtml[cardId + '/' + bestLang]) return this.cardHtml[cardId + '/' + bestLang];
            const { html } = await import(`@/assets/_cards/${cardId}/${bestLang}/index.md`);
            this.cardHtml[cardId + '/' + bestLang] = html;
        },
        async fetchCardsLinks(cardId, i18n) {
            const promises = [];
            for (const linkId of this.linksFrom(cardId)) {
                promises.push(this.fetchLinkContent(linkId, i18n));
            }
            for (const linkId of this.linksTo(cardId)) {
                promises.push(this.fetchLinkContent(linkId, i18n));
            }
            await Promise.all(promises);
        },
        async fetchLinkContent(linkId, i18n) {
            const langs = this.links[linkId].langs;
            const bestLang = findBestAvailableLang(i18n, langs);
            if (this.linkContent[linkId + '/' + bestLang]) return this.linkContent[linkId + '/' + bestLang];
            const { html, attributes } = await import(`@/assets/_links/${linkId}/${bestLang}/index.md`);
            this.linkContent[linkId + '/' + bestLang] = { html, attributes };
        },
        async fetchCardSvg(cardId, i18n, variant, side) {
            if (import.meta.env.SSR) return;

            if (this.svgs[side][cardId + '/' + i18n + '/' + variant]) return this.svgs[side][cardId + '/' + i18n + '/' + variant];

            // TODO fixme
            const response = await fetch(this.image(cardId, i18n, 'svg', variant, side));
            const svgString = await response.text();

            this.svgs[side][cardId + '/' + i18n + '/' + variant] = svgString;
        },
    },
});

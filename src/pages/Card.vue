<script setup>
import { useCardsStore } from '@/stores/cards.js';
import { useI18nStore } from '@/stores/i18n.js';
import { useMetaStore } from '@/stores/meta.js';
</script>

<template>
    <card-view-swiper v-if="useSwipper" :cardId="cardId" />
    <card-view v-else :cardId="cardId" />
</template>

<script>
import CardViewSwiper from '@/components/cards/CardViewSwiper.vue';
import CardView from '@/components/cards/CardView.vue';

// Pinia/store

function setMeta(cardId, lang, version, useSSR) {
    const cardStore = useCardsStore();
    const i18nStore = useI18nStore();
    const metaStore = useMetaStore();
    metaStore.setOgUrl(useSSR ? '' : window.location.pathname);
    metaStore.setOgLocale(lang);

    metaStore.setTitle(i18nStore.label('fresk-label', lang) + ' - ' + cardStore.title(cardId, lang));

    metaStore.setDescription(cardStore.backDescription(cardId, lang));
    metaStore.setImage(cardStore.image(cardId, lang, 'default', version, 'front'));
}

export default {
    name: 'CardPage',
    props: ['cardId'],
    data() {
        return {
            useSwipper: !this.$useSSR && window.innerWidth <= 768,
        };
    },
    components: { CardView, CardViewSwiper },
    created() {
        const cardStore = useCardsStore();
        setMeta(this.cardId, this.$route.params.lang, this.$route.params.version, this.$useSSR);
        cardStore.fetchEverythingForCard(this.cardId, this.$route.params.lang, this.$route.params.version).then(() => {
            setMeta(this.cardId, this.$route.params.lang, this.$route.params.version, this.$useSSR);
        });
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
    },
    beforeRouteEnter(to, _from, next) {
        const cardStore = useCardsStore();
        if (!cardStore.exists(to.params.cardId, to.params.version)) {
            // TODO: custom message
            next({ name: 'error', params: to.params });
            return;
        }
        next();
    },
    beforeRouteUpdate(to, _from, next) {
        const cardStore = useCardsStore();
        if (!cardStore.exists(to.params.cardId, to.params.version)) {
            // TODO: custom message
            next({ name: 'error', params: to.params });
            return;
        }

        cardStore.fetchEverythingForCard(to.params.cardId, to.params.lang, to.params.version).then(() => {
            setMeta(to.params.cardId, to.params.lang, to.params.version, this.$useSSR);
        });

        next();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        onResize() {
            this.useSwipper = !this.$useSSR && window.innerWidth <= 768;
        },
    },
};
</script>

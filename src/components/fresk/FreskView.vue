<script setup>
import { useCardsStore } from '@/stores/cards.js';
import { useFreskStore } from '@/stores/fresks.js';
import { useI18nStore } from '@/stores/i18n.js';
import { useMetaStore } from '@/stores/meta.js';
import FreskTopBanner from '@/components/fresk/FreskTopBanner.vue';
import FreskBottomBanner from '@/components/fresk/FreskBottomBanner.vue';
import FreskCaption from '@/components/fresk/FreskCaption.vue';
import FreskVisjsInterface from '@/components/fresk/FreskVisjsInterface.vue';
import { toFreskCoordinates, CARD_SIZE } from '@/components/fresk/utils.js';
import { computed, watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    lot: {
        type: String,
        required: true,
    },
    quiz: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();
const router = useRouter();
const freskStore = useFreskStore();
const cardsStore = useCardsStore();
const i18nStore = useI18nStore();
const metaStore = useMetaStore();
const { locale } = useI18n();

const selectedCardId = ref(undefined);
const visibleCards = ref([]);
const mounted = ref(false);

const freskId = computed(() => {
    const fresks = freskStore.availableFresks(props.lot, route.params.version);
    return fresks.length > 0 ? fresks[0] : null;
});

const nodes = computed(() => {
    return freskStore.data(freskId.value).nodes.map((node) => {
        const { x, y } = toFreskCoordinates(node.xPos, node.yPos);
        return {
            ...node,
            id: node.cardId,
            shape: 'image',
            image:
                props.quiz && !visibleCards.value.includes(node.cardId)
                    ? '/local/unknown-card.png'
                    : cardsStore.image(node.cardId, locale.value, 'default', route.params.version, 'front'),
            x,
            y,
            size: (node.zoom || 1) * CARD_SIZE,
        };
    });
});

const edges = computed(() => {
    return freskStore.data(freskId.value).edges;
});

const background = computed(() => {
    const data = freskStore.data(freskId.value);
    if (!data.background) return [];
    return data.background;
});

const onNodeSelection = (cardId) => {
    selectedCardId.value = cardId;
    if (!visibleCards.value.includes(cardId)) visibleCards.value.push(cardId);
    else visibleCards.value.splice(visibleCards.value.indexOf(cardId), 1);
};

const onNodeDeselection = () => {
    selectedCardId.value = undefined;
};

const onNodeDoubleSelection = (cardId) => {
    router.push({
        name: 'RouteCardDetails',
        params: { ...route.params, cardId: cardId },
    });
};

onMounted(() => {
    freskStore.fetchFresk(freskId.value);
    metaStore.setTitle(i18nStore.label('title', locale.value));
    metaStore.setImage(i18nStore.asset('previews', locale.value));
    metaStore.setOgUrl(import.meta.env.SSR ? '' : window.location.pathname);
    metaStore.setDescription(i18nStore.label('description', locale.value));
    metaStore.setOgLocale(locale.value);
    // Mounted is not called during SSR
    mounted.value = true;
});

watch(freskId, (newVal) => {
    if (newVal === null) {
        router.push({ name: 'RouteHome', params: route.params });
    } else {
        freskStore.fetchFresk(newVal);
    }
});
</script>

<template>
    <FreskTopBanner :title="freskStore.title(freskId, locale)" />
    <FreskVisjsInterface
        v-if="mounted"
        id="network"
        :nodes="nodes"
        :edges="edges"
        :background="background"
        @node-double-selection="onNodeDoubleSelection"
        @node-selection="onNodeSelection"
        @node-deselection="onNodeDeselection" />
    <freskCaption :freskId="freskId" />
    <FreskBottomBanner v-if="selectedCardId" :selectedCardId="selectedCardId" />
</template>

<style lang="sass">
#network
  height: calc(100vh - 130px)
  @media only screen and (max-width: 480px)
    height: calc(100vh - 165px)
</style>

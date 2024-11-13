<script setup>
import { useI18nStore } from '@/stores/i18n.js';
import { useMetaStore } from '@/stores/meta.js';
import { useCardsStore } from '@/stores/cards.js';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import LotsFilter from '@/components/cards/LotsFilter.vue';
import CardsGrid from '@/components/cards/grid/CardsGrid.vue';
import ToggleView from '@/components/cards/list/ToggleView.vue';
import CardsList from '@/components/cards/list/CardsList.vue';
import FreskView from '@/components/fresk/FreskView.vue';

const props = defineProps({
    view: {
        type: String,
        required: false,
        default: 'grid',
        validator: (value) => ['grid', 'list', 'network', 'quiz'].includes(value),
    },
    lang: String,
    version: String,
});

const route = useRoute();
const { locale } = useI18n();
const i18nStore = useI18nStore();
const metaStore = useMetaStore();
const cardStore = useCardsStore();

const availableSets = ref(cardStore.lots);
const sets = ref(cardStore.lots);
const selectedView = computed(() => {
    if (['grid', 'list', 'network', 'quiz'].includes(props.view)) return props.view;
    return 'grid';
});

const maxSet = computed(() => {
    return sets.value.reduce((max, val) => (max > val ? max : val));
});

const setSets = ({ set }) => {
    sets.value = availableSets.value.filter((s) => s <= set);
};

metaStore.setTitle(i18nStore.label('title', locale.value));
metaStore.setDescription(i18nStore.label('description', locale.value));
metaStore.setImage(i18nStore.asset('previews', locale.value));
metaStore.setOgUrl(import.meta.env.SSR ? '' : window.location.pathname);
metaStore.setOgLocale(locale.value);

const cards = computed(() => {
    return cardStore.cardsInLots(sets.value, route.params.version).map((cardId) => {
        return {
            id: cardId,
            image: cardStore.image(cardId, locale.value, 'default', route.params.version, 'front'),
            num: cardStore.cards[cardId].num,
            title: cardStore.title(cardId, locale.value),
        };
    });
});
</script>

<template>
    <div class="menu">
        <ToggleView :selectedView="selectedView" />
        <LotsFilter :sets="sets" @toggleSet="setSets" />
    </div>
    <CardsList v-if="selectedView === 'list'" :cards="cards" />
    <FreskView v-else-if="selectedView === 'network' || selectedView === 'quiz'" :lot="maxSet" :quiz="selectedView === 'quiz'" />
    <CardsGrid v-else :cards="cards" />
</template>

<style scoped lang="sass">
.title
  font-weight: 500
  font-size: 1.2rem
  line-height: 1.4em
  margin: 0.6rem auto

.menu
  max-width: 1400px
  width: 95vw
  display: flex
  justify-content: space-around
  margin: 0.2rem auto
  flex-wrap: wrap

@media screen and (min-width: 700px)
  .menu
    justify-content: space-between
</style>

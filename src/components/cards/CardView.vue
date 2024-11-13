<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import CardTitle from '@/components/cards/CardTitle.vue';
import CardFront from '@/components/cards/CardFront.vue';
import CardBack from '@/components/cards/CardBack.vue';
import CardMenu from '@/components/cards/CardMenu.vue';
import CardLinks from '@/components/cards/CardLinks.vue';
import CardExplanation from '@/components/cards/CardExplanation.vue';
import CardSpaceArea from '@/components/cards/CardSpaceArea.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    cardId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const cardsStore = useCardsStore();

const variant = computed(() => route.params.version);
const cardNum = computed(() => cardsStore.num(props.cardId));
const { locale } = useI18n();
</script>

<template>
    <div class="card-details">
        <div class="card-details-panel">
            <CardTitle :cardNum="cardNum" :cardTitle="cardsStore.title(props.cardId, locale)" />
            <CardMenu :previousCardId="cardsStore.previousId(props.cardId, variant)" :nextCardId="cardsStore.nextId(props.cardId, variant)" />
            <CardFront :cardId="props.cardId" :key="'front' + props.cardId" />
            <CardBack :cardId="props.cardId" :key="'back' + props.cardId" v-if="!cardsStore.isFrontOnly(props.cardId)" />
            <CardMenu :previousCardId="cardsStore.previousId(props.cardId, variant)" :nextCardId="cardsStore.nextId(props.cardId, variant)" />
            <CardExplanation :cardId="props.cardId" :key="'explanation' + props.cardId" />
            <CardSpaceArea :cardId="props.cardId" :key="'spacearea' + props.cardId" />
            <CardMenu :previousCardId="cardsStore.previousId(props.cardId, variant)" :nextCardId="cardsStore.nextId(props.cardId, variant)" />
            <CardLinks :cardId="props.cardId" />
        </div>
    </div>
</template>

<style scoped lang="sass">
.card-details
  display: flex
  justify-content: center
  &-panel
    width: 95vw
    max-width: 600px
    padding: 0
    margin: 3px
</style>

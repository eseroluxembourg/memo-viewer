<script setup lang="ts">
import CardGridItem from '@/components/cards/grid/CardGridItem.vue';
import { useRoute } from 'vue-router';
import type { PropType } from 'vue';
import { type CardGridItemType } from '@/typing';

defineProps({
    cards: {
        type: Array as PropType<CardGridItemType[]>,
        required: true,
    },
});

const route = useRoute();
</script>

<template>
    <div class="cards-grid">
        <CardGridItem v-for="card in cards" :key="`${card.id}-${route.params.version}-${route.params.lang}`" :card="card" />
    </div>
</template>

<style lang="sass">
.cards-grid
  max-width: 1400px
  width: 95vw
  display: flex
  flex-wrap: wrap
  justify-content: space-around
  margin: 0 auto
  align-items: center
</style>

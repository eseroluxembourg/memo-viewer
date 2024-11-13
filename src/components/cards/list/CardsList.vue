<script setup lang="ts">
import CardListItem from './CardListItem.vue';
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
    <div class="cards">
        <CardListItem v-for="card in cards" :key="card.id + route.params.version + route.params.lang" :card="card" />
    </div>
</template>

<style scoped lang="scss">
.cards {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
}
</style>

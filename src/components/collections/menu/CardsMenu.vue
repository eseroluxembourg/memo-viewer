<template>
  <div class="cards">
    <CardMenuItem v-for="card in cards" :key="card.cardNum" :card="card" />
  </div>
</template>

<script>
import CardMenuItem from './CardMenuItem.vue';
import CardsService from '@/services/CardsService';

export default {
  name: 'CardsMenu',
  components: {
    CardMenuItem,
  },
  props: {
    sets: {
      type: Array,
      required: true,
    },
  },
  computed: {
    cards() {
      return CardsService.getCards().filter((card) =>
        this.sets.includes(card.cardSet)
      );
    },
  },
};
</script>

<style scoped>
.cards {
  max-width: 1400px;
  width: 95vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 0 auto;
  align-items: center;
}
</style>

<template>
  <div class="cards">
    <CardListItem v-for="card in cards" :key="card.cardNum" :card="card" />
  </div>
</template>

<script>
import CardListItem from './CardListItem.vue';
import CardsService from '@/services/CardsService';

export default {
  name: 'CardsList',
  components: {
    CardListItem,
  },
  props: {
    sets: {
      type: Array,
      required: true,
    },
  },
  computed: {
    cards() {
      return CardsService.getCards().filter((c) =>
        this.sets.includes(c.cardSet)
      );
    },
  },
};
</script>
<style scoped>
.cards {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
}
</style>

<template>
  <div class="bg">
    <div v-if="selectedCard" class="banner">
      <span>{{ $t('cards.' + selectedCard.cardNum + '.title') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layout: Object,
    cards: Object,
    selectedCard: Object,
  },
};
</script>

<style scoped>
.bg {
  background-color: #efeeee;
  height: 67px;
}
.banner {
  padding: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--primary);
  text-shadow: #5a5a5a 1px 1px;
}
</style>

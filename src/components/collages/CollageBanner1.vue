<template>
  <div class="banner">
    <h2>{{ $t(layout.titleKey) }}</h2>
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
.banner {
  color: var(--primary);
  text-shadow: #5a5a5a 1px 1px;
  padding: 0.1rem 0;
  text-align: center;
  margin: 0 1rem;
}
</style>

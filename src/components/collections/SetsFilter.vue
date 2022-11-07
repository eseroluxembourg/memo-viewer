<template>
  <div class="sets">
    <div
      v-for="set in availableSets"
      :key="set"
      class="set"
      :class="{ selected: isSetSelected(set) }"
      @click="toggleSet(set)"
    >
      {{ $t('all-cards.set') }} {{ set }}
    </div>
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  components: {},
  props: {
    sets: {
      type: Array,
      default() {
        return [1, 2, 3, 4, 5];
      },
    },
  },
  methods: {
    isSetSelected(set) {
      return this.sets.includes(set);
    },
    toggleSet(set) {
      this.$emit('toggleSet', { set });
    },
  },
  computed: {
    availableSets: function () {
      return CardsService.getSets();
    },
  },
};
</script>

<style scoped>
.sets {
  display: flex;
  padding: 0.4rem 0.6rem;
}

.set {
  bottom: 0px;
  margin: auto 0.2rem auto 0.2rem;
  padding: 0.1rem 0.4rem;
  font-size: max(1rem, min(2.5vw, 1.5rem));
  text-transform: capitalize;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 5px;

  color: #555;
  background-color: #aaa;
}

.selected {
  color: #fff;
  background-color: var(--primary);
}

.selected:hover {
  background-color: var(--secondary);
}
</style>

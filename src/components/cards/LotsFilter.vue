<script setup>
import { useCardsStore } from '@/stores/cards.js';

const props = defineProps({
    sets: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['toggleSet']);

const cardStore = useCardsStore();

const isSetSelected = (set) => {
    return props.sets.includes(set);
};

const toggleSet = (set) => {
    emit('toggleSet', { set });
};
</script>

<template>
    <div class="sets">
        <div v-for="set in cardStore.lots" :key="set" class="set" :class="{ selected: isSetSelected(set) }" @click="toggleSet(set)">
            {{ $t('all-cards.set') }} {{ set }}
        </div>
    </div>
</template>

<style lang="sass">
$primary: var(--primary)
$secondary: var(--secondary)

.sets
  #display: flex
  display: none
  padding: 0.4rem 0.6rem

.set
  display: none
  bottom: 0px
  margin: auto 0.2rem auto 0.2rem
  padding: 0.1rem 0.4rem
  font-size: max(1rem, min(2.5vw, 1.5rem))
  text-transform: capitalize
  white-space: nowrap
  cursor: pointer
  border-radius: 5px

  color: #555
  background-color: #aaa

  &.selected
    color: #fff
    background-color: $primary

    &:hover
      background-color: $secondary
</style>

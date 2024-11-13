<script setup>
import { useCardsStore } from '@/stores/cards.js';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    selectedCardId: {
        type: String,
        required: true,
    },
});

const cardStore = useCardsStore();
const { locale } = useI18n();
watch(
    () => props.selectedCardId,
    (newVal) => {
        if (newVal) {
            cardStore.fetchCardAttributes(newVal, locale.value);
        }
    },
    { immediate: true },
);
watch(
    () => locale.value,
    (newVal) => {
        if (newVal) {
            cardStore.fetchCardAttributes(props.selectedCardId, newVal);
        }
    },
);
</script>

<template>
    <div class="bg">
        <div v-if="props.selectedCardId" class="bottom-banner">
            <span>{{ cardStore.title(props.selectedCardId, locale) }}</span>
        </div>
    </div>
</template>

<style scoped lang="sass">
$primary: var(--primary)

.bg
  z-index: 30
  background-color: #efeeee
  height: auto
  position: fixed
  bottom: 0%
  width: 100%

.bottom-banner
  padding: 1rem
  font-size: 1.8rem
  font-weight: 600
  color: $primary
  text-shadow: #5a5a5a 1px 1px

  @media only screen and (max-width: 480px)
    font-size: 1rem
</style>

<script setup>
import { useRoute } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    cardId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const cardStore = useCardsStore();
const { locale } = useI18n();
</script>

<template>
    <div class="back">
        <picture class="card-back" v-if="!cardStore.image(props.cardId, locale, 'svg', route.params.version, 'back')" v-lazyload>
            <source
                :data-srcset="cardStore.image(props.cardId, locale, 'webset', route.params.version, 'back')"
                sizes="(max-width:800px) 30vw, 240px"
                type="image/webp"
                :srcset="cardStore.image(props.cardId, locale, 'webset', route.params.version, 'back')" />
            <img :data-src="cardStore.image(props.cardId, locale, 'default', route.params.version, 'back')" />
        </picture>
        <div class="card-back-img" :innerHTML="cardStore.cardSvg(props.cardId, locale, route.params.version, 'back')" />
    </div>
</template>

<style lang="sass">
.back
  margin: 0.8rem 0
  box-shadow: 1px 1px 4px #706f71
  width: 95vw
  max-width: 594px
  display: flex
  flex-direction: column
  align-content: stretch

.card-back
  img
    padding-bottom: 56%
    width: 100%
    &.loaded
      padding-bottom: 0
  &-img
    svg
      width: 100%
      height: 100%
</style>

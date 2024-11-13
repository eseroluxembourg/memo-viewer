<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { type PropType } from 'vue';
import { CardGridItemType } from '@/typing';

const props = defineProps({
    card: {
        type: Object as PropType<CardGridItemType>,
        required: true,
    },
});

const route = useRoute();
const { locale } = useI18n();

const cardItemStyle = computed(() => {
    const widthPercentage = 20;
    const heightPercentage = (17 / 25) * widthPercentage;
    const widthMinPx = 100;
    const heightMin = (17 / 25) * widthMinPx;
    return {
        width: `${widthPercentage}vmin`,
        height: `${heightPercentage}vmin`,
        'min-width': `${widthMinPx}px`,
        'min-height': `${heightMin}px`,
    };
});
</script>

<template>
    <router-link
        :key="`link-${props.card.id}`"
        :to="{
            name: 'RouteCardDetails',
            params: { cardId: props.card.id, lang: locale, version: route.params.version },
        }">
        <div class="card-grid-item" :style="cardItemStyle">
            <div class="card-grid-item-num">
                <img class="card-grid-item-logo" src="@/assets/icons/card-number-icon.svg" :alt="card.num" />
                <div class="card-grid-item-digit">{{ card.num }}</div>
            </div>
            <div class="card-grid-item-image-wrapper">
                <picture v-lazyload>
                    <source :data-srcset="card.image" sizes="(max-width:450px) 80px, 200px" type="image/webp" />
                    <img v-if="locale" :id="locale" class="card-grid-item-image" :data-url="card.image" :alt="card.title" :title="card.title" />
                </picture>
            </div>
        </div>
    </router-link>
</template>

<style lang="sass">
$shadow-color: #706f71

.card-grid-item
  margin: max(3px, 0.4vw)
  position: relative
  &:hover
    transform: scale(1.1)
  .card-num-logo
    opacity: 1
  &-num
    width: 100%
    height: 85%
    margin: 0 auto
    margin-top: 15%
    text-align: center
    position: absolute
    z-index: 2
  &-logo
    position: absolute
    width: 60%
    height: 90%
    left: 20%
    opacity: 0.5
  &-digit
    color: #fff
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-weight: 600
    font-size: max(1.5rem, 5vmin)
    font-family: 'Avenir Next', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica', Arial, sans-serif
    text-shadow: 1px 1px #444

.card-grid-item-image-wrapper
  width: 100%
  height: 100%
  box-shadow: 1px 1px 4px $shadow-color
  &:hover
    box-shadow: 3px 3px 7px $shadow-color

.card-grid-item-image
  width: 100%
  height: 100%
  padding: 0
  cursor: pointer
</style>

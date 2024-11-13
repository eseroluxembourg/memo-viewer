<script setup>
import { useRoute } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import { computed } from 'vue';
import ArrowCause from '@/components/icons/ArrowCause.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    causeId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const cardStore = useCardsStore();
const { locale } = useI18n();

const link = computed(() => cardStore.link(props.causeId));

const getLinkStyle = (classPrefix, linkStatus) => {
    return {
        [`${classPrefix}valid`]: linkStatus === 'valid',
        [`${classPrefix}optional`]: linkStatus === 'optional',
        [`${classPrefix}invalid`]: linkStatus === 'invalid',
    };
};
</script>

<template>
    <div class="causeParent">
        <div class="cause">
            <router-link
                :to="{
                    name: 'RouteCardDetails',
                    params: { cardId: link.fromCardId, lang: locale, version: route.params.version },
                }">
                <picture v-lazyload>
                    <source
                        :data-srcset="cardStore.image(link.fromCardId, locale, 'webset', route.params.version, 'front')"
                        sizes="(max-width:800px) 30vw, 240px"
                        type="image/webp" />
                    <img
                        class="cause-card-image"
                        :class="getLinkStyle('cause-card-image-', link.status)"
                        :data-src="cardStore.image(link.fromCardId, locale, 'default', route.params.version, 'front')"
                        :alt="cardStore.title(link.fromCardId, locale)"
                        :title="cardStore.title(link.fromCardId, locale)" />
                </picture>
            </router-link>
            <div class="arrow-anchor">
                <span class="arrow" :class="getLinkStyle('arrow-', link.status)">
                    <ArrowCause />
                </span>
            </div>
            <p class="cause-target">
                <picture v-lazyload>
                    <source
                        :data-srcset="cardStore.image(link.toCardId, locale, 'webset', route.params.version, 'front')"
                        sizes="(max-width:800px) 20vw, 160px"
                        type="image/webp" />
                    <img
                        class="cause-card-image-original"
                        :data-src="cardStore.image(link.toCardId, locale, 'default', route.params.version, 'front')"
                        :alt="cardStore.title(link.toCardId, locale)"
                        :title="cardStore.title(link.toCardId, locale)" />
                </picture>
            </p>
        </div>
    </div>
    <div class="cause-explanation">
        <div v-html="cardStore.linkHtml(props.causeId, locale)" />
        <hr class="item-separator" />
    </div>
</template>

<style lang="sass" scoped>
$primary: var(--primary)
$secondary: var(--secondary)
$ternary: var(--ternary)
$shadow-color: #706f71

.cause
  margin: 0.5rem 0.3rem

  .cause-card-image
    float: left
    width: 30vw
    max-width: 240px
    padding: 0
    margin: 0 2.8rem 0.2rem 0
    box-shadow: 5px 5px 0px $shadow-color
    z-index: 3

    &:hover
      transform: scale(1.03)
      max-width: 248px

    &-valid
      box-shadow: 5px 5px 0px $primary

    &-optional
      box-shadow: 5px 5px 0px $ternary

    &-invalid
      box-shadow: 5px 5px 0px $secondary

  .cause-card-image-original
    width: 20vw
    max-width: 160px
    padding: 0
    margin: 0
    box-shadow: 2px 2px 0px $shadow-color
    z-index: 3
    opacity: 0.5

  .cause-target
    padding: 0.1rem
    margin: 0
    float: left

.cause-explanation
  padding: 0.1rem
  margin: 0.7rem 0
  text-align: justify

  &:first-letter
    text-transform: capitalize
    font-size: 130%

  .item-separator
    margin: 1rem auto
    width: 30%
    color: $primary
    box-shadow: 3px 3px 0px $secondary

.arrow-anchor
  position: relative
  width: 5px
  height: 5px
  float: left

  .arrow
    svg
      z-index: -1
      transform: translate(-50%, -50%) scale(0.8) translate(-50%, 50%)
      fill: $shadow-color

    &-valid svg
      fill: $primary

    &-optional svg
      fill: $ternary

    &-invalid svg
      fill: $secondary
</style>

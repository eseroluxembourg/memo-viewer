<script setup>

// import { useRoute } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

// const route = useRoute();
const cardStore = useCardsStore();
const { locale } = useI18n();
const props = defineProps({
    cardId: {
        type: String,
        required: true,
    },
});

const imageLoaded = ref(false);
const gifLoaded = ref(false);
</script>

<template>
<div 
class="space-area"
v-if="
    imageLoaded ||
    gifLoaded ||
    cardStore.spaceText(props.cardId, locale)        !== undefined ||
    cardStore.spaceYoutubeCode(props.cardId, locale) !== undefined ||
    cardStore.spaceUrl(props.cardId, locale)         !== undefined
"
>

    <div
        v-html="$t('card.space-area-title')"
        class="space-area-title"
    ></div>

    <div v-if="cardStore.spaceText(props.cardId, locale) !== undefined" v-html="cardStore.spaceText(props.cardId, locale)" class="space-area-text"></div>

    <div class="space-area-wrapper" v-if="cardStore.gifSpaceArea(props.cardId, locale) !== undefined" :style="{display: gifLoaded ? 'inline' : 'none'}">
        <div class="space-area-image">
            <a :href="locale + '/' + props.cardId + '/space-area-image'" class="space-area-front">
                <img :src="cardStore.gifSpaceArea(props.cardId, locale)" @load="gifLoaded=true" @error="gifLoaded=false">
            </a>
        </div>
    </div>

    <div class="space-area-wrapper" v-if="cardStore.imageSpaceArea(props.cardId, locale) !== undefined" :style="{display: imageLoaded ? 'inline' : 'none'}">
        <div class="space-area-image">
            <a :href="locale + '/' + props.cardId + '/space-area-image'" class="space-area-front">
                <img :src="cardStore.imageSpaceArea(props.cardId, locale)" @load="imageLoaded=true" @error="imageLoaded=false">
            </a>
        </div>
    </div>

    <div class="space-area-wrapper" v-if="cardStore.spaceYoutubeCode(props.cardId, locale) !== undefined">
        <div class="card-video-wrapper">
            <iframe
            class="card-video"
            :src="`https://www.youtube-nocookie.com/embed/${cardStore.spaceYoutubeCode(props.cardId, locale)}?vq=small`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            importance="low"
            name="card-video"
            referrerpolicy="no-referrer"></iframe>
        </div>
    </div>

    <div v-if="cardStore.spaceCredits(props.cardId, locale) !== undefined">
        <span v-html="`${$t('card.space-area-credits-label')} :`" class="space-area-credits-label"></span>
        <span v-html="cardStore.spaceCredits(props.cardId, locale)" class="space-area-credits"></span>
    </div>

    <div class="space-area-wrapper" v-if="cardStore.spaceUrl(props.cardId, locale) !== undefined">
        <div class="menu-panel">
            <a :href="cardStore.spaceUrl(props.cardId, locale)" target="_blank" class="space-area-link">
                <img class="space-area-logo" :src="`/local/spacearea/image-link.png`" />
            </a>
        </div>
    </div>

</div>
</template>

<style scoped lang="sass">
.space-area
  img
    max-width: 100%
    max-height: 500px
    margin-left: auto
    margin-right: auto

.space-area
  margin: 1rem 1rem
  max-width: 600px
  font-size: 1rem
  text-align: left
  line-height: 1.6rem

.space-area-title
    font-weight: 700
    font-size: 2rem
    //margin: 0 0.5rem 0.5rem
    padding: 5px 0px

.space-area-credits-label
    font-weight: 700
    //font-size: 2rem
    //margin: 0 0.5rem 0.5rem
    padding: 5px

.space-area-text
    padding: 5px 0px

.space-area-credits
    padding: 5px 0px

.footnotes-sep
  color: #fff
  border-top: 1px solid #cecece
  max-width: 200px
  margin-left: 0
  border-bottom: unset

.footnote-ref a,
.footnote-backref
  text-decoration: none

.footnote-ref a,
.footnote-item
  padding-top: 100px
  margin-top: -100px
  &:before
    //  content: " ";
    padding-top: 100px
    margin-top: -100px
    visibility: hidden

p
  margin: 0

.space-area-image
    width: 100%
    #box-shadow: 1px 1px 4px #706f71
    svg
      #width: 100%
      #height: 100%
    png
      #width: 100%
      #height: 100%

.space-area-front
    img
        padding-bottom: 0%
        width: 100%

    &.loaded img
        padding-bottom: 0

.space-area-wrapper
  padding: 5px 0px

.space-area-logo
    height: 100px
    margin: 0 0.3rem

.space-area-link
    display: flex
    &:hover
      transform: scale(1.1)

.space-area-link,
.space-area-link:active,
.space-area-link:focus
    outline: none
</style>
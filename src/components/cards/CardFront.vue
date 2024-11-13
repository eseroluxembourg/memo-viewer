<script setup>
import { ref, watch } from 'vue';
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
const showVideo = ref(false);
const { locale } = useI18n();

const switchVideo = () => {
    showVideo.value = !showVideo.value;
};

watch(
    () => props.cardId,
    () => {
        showVideo.value = false;
    },
);
</script>

<template>
    <div class="card-image" v-if="!showVideo">
        <picture v-if="!cardStore.cardSvg(props.cardId, locale, route.params.version, 'front')" v-lazyload class="card-front">
            <source
                :data-srcset="cardStore.image(props.cardId, locale, 'webset', route.params.version, 'front')"
                sizes="(max-width:800px) 30vw, 240px"
                type="image/webp" />
            <img :data-src="cardStore.image(props.cardId, locale, 'default', route.params.version, 'front')" />
        </picture>
        <div class="back-img" :innerHTML="cardStore.cardSvg(props.cardId, locale, route.params.version, 'front')" />
    </div>
    <div class="card-video-wrapper" v-if="showVideo">
        <iframe
            class="card-video"
            :src="`https://www.youtube-nocookie.com/embed/${cardStore.youtubeCode(props.cardId, locale)}?vq=small`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            importance="low"
            name="card-video"
            referrerpolicy="no-referrer"></iframe>
    </div>
    <div class="menu-panel">
        <img
            v-if="cardStore.youtubeCode(props.cardId, locale)"
            class="yt-logo"
            src="/assets/play-youtube.png"
            :title="$t('card.video-link-title')"
            @click="switchVideo" />
        <a v-if="cardStore.wikiUrl(props.cardId, locale)" :href="cardStore.wikiUrl(props.cardId, locale)" target="_blank" class="wiki-link">
            <img class="wiki-logo" src="/assets/wiki-40.png" :title="$t('card.wiki-link-title')" />
        </a>
        <a
            v-if="cardStore.instagramCode(props.cardId, locale) != ''"
            :href="`https://instagram.com/p/${cardStore.instagramCode(props.cardId, locale)}`"
            target="_blank"
            class="wiki-link">
            <img class="wiki-logo" src="/assets/instagram.png" :title="$t('card.instagram-link-title')" />
        </a>
    </div>
</template>

<style lang="sass">
.card-front
    img
        padding-bottom: 56%
        width: 100%

    &.loaded img
        padding-bottom: 0

.card-image
    width: 100%
    box-shadow: 1px 1px 4px #706f71
    svg
      width: 100%
      height: 100%


.card-video-wrapper
    position: relative
    padding-bottom: 68%

.card-video
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

.menu-panel
    margin-bottom: 0.3rem
    padding: 0.3rem 0.5rem
    display: flex
    justify-content: flex-end

.wiki-link
    display: flex
    &:hover
      transform: scale(1.1)

.wiki-link,
.wiki-link:active,
.wiki-link:focus
    outline: none

.wiki-logo
    width: 1.8rem
    height: 1.8rem
    margin: 0 0.3rem

.yt-logo
    width: 2rem
    height: 2rem
    margin: 0 0.3rem
    &:hover
      transform: scale(1.1)
</style>

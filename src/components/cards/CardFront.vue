<template>
  <div class="card-image back" v-if="!videoAvailable || !showVideo">
    <picture v-if="!svgString">
      <source
        :srcset="imgPathWebp"
        sizes="(max-width:800px) 30vw, 240px"
        type="image/webp"
      />
      <img :src="imgPathDefault" />
    </picture>
    <div id="back-img" :innerHTML="svgString" />
  </div>
  <div class="card-video-wrapper" v-if="videoAvailable && showVideo">
    <iframe
      class="card-video"
      :src="`https://www.youtube-nocookie.com/embed/${$t(
        'cards.' + this.card.cardNum + '.videoYoutubeCode'
      )}?vq=small`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      importance="low"
      name="card-video"
      referrerpolicy="no-referrer"
    ></iframe>
  </div>
  <div class="menu-panel">
    <img
      v-if="videoAvailable"
      class="yt-logo"
      src="@/assets/play-youtube.png"
      :title="$t('card.video-link-title')"
      @click="switchVideo"
    />
    <a
      v-if="$t('cards.' + card.cardNum + '.wikiUrl')"
      :href="`${$t('local.config.wiki-root-url')}${$t(
        'cards.' + card.cardNum + '.wikiUrl'
      )}`"
      target="_blank"
      class="wiki-link"
    >
      <img
        class="wiki-logo"
        src="@/assets/wiki-40.png"
        :title="$t('card.wiki-link-title')"
      />
    </a>
    <a
      v-if="$t('cards.' + card.cardNum + '.instagramCode')"
      :href="`${$t('local.config.instagram-root-url')}${$t(
        'cards.' + card.cardNum + '.instagramCode'
      )}`"
      target="_blank"
      class="wiki-link"
    >
      <img
        class="wiki-logo"
        src="@/assets/icons/instagram.png"
        :title="$t('card.instagram-link-title')"
      />
    </a>
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';
// Todo : unifier les interfaces cardFront & CardBack
export default {
  name: 'CardFront',
  props: {
    card: Object,
  },
  data() {
    return {
      showVideo: false,
      svgString: undefined,
    };
  },
  mounted() {
    this.load();
  },
  computed: {
    videoAvailable() {
      return (
        this.$t('cards.' + this.card.cardNum + '.videoYoutubeCode') !==
        'cards.' + this.card.cardNum + '.videoYoutubeCode'
      );
    },
    imgPathDefault() {
      return `${process.env.BASE_URL}cards/${this.$i18n.locale}/default/${this.card.cardNum}-front.jpg`;
    },
    imgPathWebp() {
      return CardsService.getCardImgSrcSet(
        this.$i18n.locale,
        this.card.cardNum
      );
    },
  },
  methods: {
    switchVideo() {
      this.showVideo = !this.showVideo;
    },
    load() {
      const svgUrl = CardsService.getFrontCardImgSvg(
        this.$i18n.locale,
        this.card.cardNum
      );
      this.svgString = undefined;
      fetch(svgUrl)
        .then((response) => response.text())
        .then((svgString) => {
          this.svgString = svgString;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    card: function () {
      this.showVideo = false;
    },
  },
};
</script>

<style>
.card-image {
  width: 100%;
  box-shadow: 1px 1px 4px #706f71;
}

.card-image svg {
  width: 100%;
  height: 100%;
}

.card-video-wrapper {
  position: relative;
  padding-bottom: 68%;
}
.card-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.menu-panel {
  margin-bottom: 0.3rem;
  padding: 0.3rem 0.5rem;
  display: flex;
  justify-content: flex-end;
}
.wiki-link {
  display: flex;
}
.wiki-link:hover {
  transform: scale(1.1);
}
.wiki-link,
.wiki-link:active,
.wiki-link:focus {
  outline: none;
}
.wiki-logo {
  width: 1.8rem;
  height: 1.8rem;
  margin: 0 0.3rem;
}
.yt-logo {
  width: 2rem;
  height: 2rem;
  margin: 0 0.3rem;
}
.yt-logo:hover {
  transform: scale(1.1);
}
</style>

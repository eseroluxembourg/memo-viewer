<template>
  <div class="card-media" v-if="spaceModeEnabled">
    <!-- Take embed link (share -> "<embed>") -->
    <video v-if="type === 'video'" controls>
      <source
        v-for="video in spaceVideoPaths"
        :key="video.src"
        :src="video.src"
        :type="video.type"
      />
    </video>

    <img v-if="type === 'image'" :src="spaceImgPath" alt="Image ou Gif" />

    <iframe
      v-if="type === 'youtube'"
      width="594"
      height="403"
      :src="spaceYoutubePath"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  name: 'CardMedia',
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    source: String | [Object],
    type: String,
    card: Object,
  },
  data() {
    return {
      spaceModeEnabled:
        localStorage.getItem('spaceModeEnabled') === 'true' ??
        this.$defaultSpaceModeEnabled,
    };
  },
  mounted() {
    window.addEventListener('localStorageChange', () => {
      console.log(localStorage.getItem('spaceModeEnabled'));
      this.spaceModeEnabled =
        localStorage.getItem('spaceModeEnabled') === 'true';
    });
  },
  computed: {
    spaceImgPath() {
      return CardsService.getSpaceImgPath(
        this.$i18n.locale,
        this.card.cardNum,
        this.source
      );
    },
    spaceVideoPaths() {
      return CardsService.getSpaceVideoPaths(
        this.$i18n.locale,
        this.card.cardNum,
        this.source
      );
    },
    spaceYoutubePath() {
      return CardsService.getSpaceYoutubePath(this.source);
    },
  },
};
</script>

<style scoped lang="scss">
.card-media {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 1px 1px 4px #706f71;
  margin: 2rem 0;

  img,
  source,
  video,
  iframe {
    width: 100%;
  }
}
</style>

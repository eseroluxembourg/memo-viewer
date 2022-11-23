<template>
  <div class="card-media" v-if="spaceModeEnabled">
    <!-- Take embed link (share -> "<embed>") -->
    <video v-if="matchVideo" controls>
      <source
        v-for="video in spaceVideoPaths"
        :key="video.src"
        :src="video.src"
      />
    </video>

    <iframe
      v-else-if="matchYoutube"
      width="594"
      height="403"
      :src="spaceYoutubePath"
      title="YouTube video player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>

    <img v-else :src="spaceImgPath" alt="Image ou Gif" />
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  name: 'CardMedia',
  props: {
    source: String,
    card: Object,
  },
  data() {
    return {
      spaceModeEnabled:
        localStorage.getItem('spaceModeEnabled') === 'true' ??
        this.$defaultSpaceModeEnabled,
      matchVideo: this.source.match(
        /\/?(?:[^"']+\/)+[^"'\s]+?\.(?:mp4|m4v|mov|qt|avi|flv|ogg)+\b/gm
      ),
      matchYoutube: this.source.match(
        /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/|\.be\/*)/gm
      ),
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

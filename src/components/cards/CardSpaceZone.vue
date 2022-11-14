<template>
  <div class="card-media">
    <video v-if="isVideo" controls>
      <source
        v-for="video in arrayVideos"
        :key="video.src"
        :src="video.src"
        :type="video.type"
      />
    </video>

    <img v-if="image" :src="source" :alt="altText" />

    <iframe
      v-if="youtubeLink"
      width="594"
      height="403"
      :src="source"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'CardMedia',
  props: {
    isVideo: Boolean,
    image: Boolean, // normal image or gif
    youtubeLink: Boolean,
    source: String,
    typeSource: String,
    arrayVideos: [Object],
    video: String,
    altText: String,
  },
  mounted() {
    console.log(this.arrayVideos);
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

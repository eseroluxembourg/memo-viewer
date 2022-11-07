<template>
  <div class="about">
    <a href="https://framagit.org/memo-fresques" target="_blank">
      <img
        class="memo-img"
        :src="`${$baseUrl}${$t('local.about.preview')}`"
        alt="Memo sur Framagit"
    /></a>
    <h3>{{ $t('about.title', { title: $t('local.config.title') }) }}</h3>
    <p v-html="$t('local.about.local-description')"></p>
    <h3>{{ $t('about.title-memo') }}</h3>
    <p v-html="$t('about.memo-description')"></p>

    <div class="footer">
      <p class="version">{{ $t('about.version') }} {{ version }}</p>
      <p class="sources" v-html="$t('about.sources')"></p>
    </div>
  </div>
</template>
<script>
import packageFile from '../../package.json';
import meta from '@/utils/meta-vue3';

export default {
  components: {},
  data() {
    return {
      version: packageFile.version,
    };
  },
  created() {
    meta.setTitle(document, this.title);
    meta.setDescription(document, this.description);
  },

  computed: {
    title() {
      return this.$t('about.title', { title: this.$t('local.config.title') });
    },
    description() {
      return this.$t('local.about.description');
    },
  },
};
</script>
<style scoped>
.about {
  width: 90vw;
  max-width: 400px;
  margin: 0 auto;
}
.memo-img {
  width: 100%;
}
.fdc-logo {
  width: 90vw;
  max-width: 400px;
}
p {
  /* margin: 1rem auto; */
  text-align: justify;
}
.list {
  text-align: left;
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
}
.footer {
  margin: 0.5rem 0;
  font-size: small;
}
.version {
  margin: 0;
  font-size: small;
}
.sources {
  margin: 0;
  font-size: small;
}
</style>

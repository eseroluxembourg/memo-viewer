<template>
  <div>
    <h1 class="title">{{ $t('langs.title') }}</h1>

    <p v-html="$t('langs.description')"></p>
    <div class="langs-block">
      <div v-for="lang in langs" :key="lang.code">
        <router-link
          class="o"
          :to="{ name: 'RouteHome', params: { lang: lang.code } }"
          >{{
            lang.code +
            (lang.language_local !== '' ? '- ' + lang.language_local : '')
          }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import langs from '@/data/langs.json';
import meta from '@/utils/meta-vue3';

export default {
  name: 'Langs',
  data: () => ({
    langs,
  }),
  created() {
    meta.setTitle(document, this.$t('langs.title'));
    meta.setDescription(document, this.$t('langs.description'));
  },
};
</script>

<style scoped>
.langs-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  max-width: 1000px;
  margin: auto;
}

.langs-block div {
  padding: 10px;
  margin: 5px;
  border: 2px var(--primary) solid;
  border-radius: 5px;
  color: #2c3e50 !important;
}

.langs-block div:hover {
  border-color: var(--secondary);
}

.langs-block div a {
  color: #2c3e50;
  text-decoration: none;
}
</style>

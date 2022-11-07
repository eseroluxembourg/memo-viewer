<template>
  <router-link
    class="fdc-link"
    :to="{ name: 'RouteLangs', params: { lang: $i18n.locale } }"
  >
    {{ currentLanguage.code }}
  </router-link>
</template>

<script>
import langs from '@/data/langs.json';

export default {
  name: 'LanguageSwitch',
  data() {
    return { langs };
  },
  computed: {
    currentLanguage: function () {
      return this.langs.find((lang) => lang.code == this.$i18n.locale);
    },
  },
};
</script>
<style scoped></style>

<template>
  <div id="nav"><Menu /></div>
  <div id="content">
    <router-view />
  </div>
</template>
<script>
import Menu from '@/components/site/Menu';
import meta from '@/utils/meta-vue3';

export default {
  components: {
    Menu,
  },
  created() {
    meta.setOgLocale(document, this.$i18n.locale);
    meta.setOgUrl(document, window.location.pathname);
    meta.setDescription(document, this.$t('local.description.site'));
    meta.setImage(
      document,
      `${process.env.BASE_URL}previews/memo-fresque-logo-1200-630-${this.$i18n.locale}.png`
    );
  },
  mounted() {
    document.dispatchEvent(new Event('x-app-rendered'));
  },
};
</script>
<style>
body {
  margin: 0;
}

#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  margin: 0;
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  min-height: 3rem;
  z-index: 999;
  background-color: white;
}

#content {
  margin: 0 auto;
  margin-top: 5rem;
}

/* Menu in two lines */
@media screen and (max-width: 450px) {
  #content {
    margin-top: 8rem;
  }
}
</style>

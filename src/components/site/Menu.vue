<template>
  <div class="menu">
    <div class="menu-left">
      <router-link
        class="fdc-link-logo"
        :to="{
          name: 'RouteHome',
          hash: '#top',
          params: { lang: $i18n.locale },
        }"
        ><img
          class="main-logo"
          :src="`${$baseUrl}logo/${$t('local.logo-full')}`"
      /></router-link>
    </div>
    <div class="menu-right">
      <router-link
        class="fdc-link"
        :to="{ name: 'RouteHome', params: { lang: $i18n.locale } }"
        >{{ $t('menu.cards') }}</router-link
      >
      <router-link
        class="fdc-link fdc-link-info"
        :to="{ name: 'RouteAbout', params: { lang: $i18n.locale } }"
        >{{ $t('menu.info') }}</router-link
      >
      <LanguageSwitch />
    </div>
  </div>
</template>
<script>
import LanguageSwitch from '@/components/site/LanguageSwitch';

export default {
  components: {
    LanguageSwitch,
  },
};
</script>
<style>
.menu {
  display: flex;
  justify-content: space-between;
  margin: 0 0.7rem;
}
.menu-left {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.menu-right {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: space-between;
  padding: 0.5rem;
}
.main-logo {
  height: calc(0.5rem + 5vw);
  min-height: 2.5rem;
  max-height: 4rem;
}
.fdc-link-logo {
  display: flex;
  justify-content: flex-start;
}

.fdc-link:hover,
.fdc-link:active,
.fdc-link.router-link-exact-active {
  padding-bottom: 0px;
  border-bottom: 3px var(--primary) solid;
}

.fdc-link {
  margin: 10px;
  color: #354657;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 3px;
}
</style>

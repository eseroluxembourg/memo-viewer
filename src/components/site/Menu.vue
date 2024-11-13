<script setup>
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitch from '@/components/site/LanguageSwitch.vue';

const route = useRoute();
const { t, locale } = useI18n();
const baseUrl = import.meta.env.VITE_BASE_URL; // Assurez-vous que cette variable est définie dans votre environnement
</script>

<template>
    <div class="menu">
        <div class="menu-left">
            <router-link
                class="fdc-link-logo"
                :to="{
                    name: 'RouteHome',
                    hash: '#top',
                    params: { lang: locale, version: route.params.version },
                }"
                ><img class="main-logo" :src="`${baseUrl}logo/${t('local.logo-full')}`"
            /></router-link>
        </div>
        <div class="menu-right">
            <router-link class="fdc-link" :to="{ name: 'RouteHome', params: { lang: locale, version: route.params.version } }">{{
                t('menu.cards')
            }}</router-link>
            <router-link class="fdc-link fdc-link-info" :to="{ name: 'RouteAbout', params: { lang: locale, version: route.params.version } }">{{
                t('menu.info')
            }}</router-link>
            <LanguageSwitch />
        </div>
    </div>
</template>

<style scoped lang="sass">
.menu
  display: flex
  justify-content: space-between
  margin: 0 0.7rem

.menu-left
  display: flex
  justify-content: flex-start
  align-items: flex-start

.menu-right
  display: flex
  justify-content: flex-end
  align-items: flex-start
  flex-wrap: wrap
  align-content: space-between
  padding: 0.5rem

.main-logo
  height: calc(0.5rem + 5vw)
  min-height: 2.5rem
  max-height: 4rem

.fdc-link-logo
  display: flex
  justify-content: flex-start

.fdc-link:hover,
.fdc-link:active,
.fdc-link.router-link-exact-active
  padding-bottom: 0px
  border-bottom: 3px var(--primary) solid

.fdc-link
  margin: 10px
  color: #354657
  text-decoration: none
  font-weight: 500
  font-size: 1.2rem
  padding-bottom: 3px
</style>

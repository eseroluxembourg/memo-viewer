<script setup>
import LanguageSwitch from '@/components/site/LanguageSwitch.vue';
import VersionSwitch from '@/components/site/VersionSwitch.vue';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import CardsIcon from '@/components/icons/CardsIcon.vue';
import { useI18nStore } from '@/stores/i18n.js';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const i18nStore = useI18nStore();
const route = useRoute();
const { t, locale } = useI18n();
</script>

<template>
    <div class="menu">
        <div class="menu-left">
            <router-link
                tabindex="0"
                class="fdc-link-logo"
                :to="{
                    name: 'RouteHome',
                    hash: '#top',
                    params: { lang: locale, version: route.params.version },
                }"
                ><img class="main-logo" :src="i18nStore.asset('logo', locale)"
            /></router-link>
        </div>
        <div class="menu-right">
            <router-link class="menu-item" tabindex="0" :to="{ name: 'RouteHome', params: { lang: locale, version: route.params.version } }">
                <CardsIcon class="icon only-mobile" />
                <span class="only-computer">{{ t('menu.cards') }}</span>
            </router-link>
            <router-link
                class="menu-item menu-item-info"
                tabindex="0"
                :to="{ name: 'RouteAbout', params: { lang: locale, version: route.params.version } }">
                <InformationCircleIcon class="icon only-mobile" />
                <span class="only-computer">
                    {{ t('menu.info') }}
                </span></router-link
            >
            <LanguageSwitch tabindex="0" />
            <VersionSwitch tabindex="0" />
        </div>
    </div>
</template>

<!-- Style is used in VersionsSwitch ^^ -->
<style lang="sass">
.only-mobile
  display: none
  @media only screen and (max-width: 480px)
    &
      display: inline

.only-computer
  display: inline
  @media only screen and (max-width: 480px)
    &
      display: none

.icon
  width: 23px
  height: 23px

.menu
  display: flex
  justify-content: space-between
  margin: 0 0.7rem
  max-height: 64px

.menu-left a
  margin: auto

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
  @media only screen and (max-width: 480px)
    &
      width: 100px
      height: unset
      max-height: unset
      min-height: unset

a.menu-item,
menu-item a
  text-decoration: none
  &:hover,
  &:active,
  &.router-link-exact-active
    padding-bottom: 0px
    border-bottom: 3px var(--primary) solid

.menu-item
  margin: 10px
  color: #354657
  font-weight: 500
  font-size: 1.2rem
  padding-bottom: 3px
</style>

<script setup>
import { useI18nStore } from '@/stores/i18n.js';
import { useMetaStore } from '@/stores/meta.js';
import { ref, onMounted, computed } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useI18n } from 'vue-i18n';
import packageFile from '../../package.json';
import settings from '@/../settings.json';
import { DEFAULT_FALLBACK_LOCALE } from '@/utils/i18n';

const i18nStore = useI18nStore();
const metaStore = useMetaStore();
const { t, locale } = useI18n();

const version = packageFile.version;
const tracker = ref(undefined);
const pageLoaded = ref(false);

i18nStore.fetchPage('about', locale.value).then(() => {
    pageLoaded.value = i18nStore.page('about', locale.value) !== undefined;
    setMeta();
});

const isSSR = computed(() => import.meta.env.SSR);

const date = computed(() => {
    try {
        return new Date().toLocaleString(locale.value);
    } catch {
        console.error(`Unexpected locale ${locale.value}`);
        return new Date().toLocaleString(DEFAULT_FALLBACK_LOCALE);
    }
});

function setMeta() {
    if (i18nStore.page('about', locale.value) !== undefined) metaStore.setTitle(i18nStore.page('about', locale.value).attributes.title);
    metaStore.setDescription(i18nStore.label('description', locale.value));
    metaStore.setOgLocale(locale.value);
    metaStore.setImage(i18nStore.asset('previews', locale.value));
    metaStore.setOgUrl(isSSR.value ? '' : window.location.pathname);
}

onMounted(() => {
    if (window.Piwki !== undefined) {
        tracker.value = window.Piwik.getTracker();
        return;
    }

    // Mounted is not called during SSR
    window.matomoAsyncInit = function () {
        tracker.value = window.Piwik.getTracker();
    };
});

onBeforeRouteUpdate((to, _from, next) => {
    pageLoaded.value = false;
    i18nStore.fetchPage('about', to.params.lang).then(() => {
        pageLoaded.value = i18nStore.page('about', to.params.lang) !== undefined;
        setMeta();
        next();
    });
});
</script>

<template>
    <div class="about">
        <a href="https://framagit.org/memo-fresques" target="_blank">
            <img class="memo-img" :src="i18nStore.asset('previews', locale)" alt="Memo sur Framagit" />
        </a>
        <template v-if="pageLoaded">
            <h3>{{ i18nStore.page('about', locale).attributes.title }}</h3>
            <p v-html="i18nStore.page('about', locale).html"></p>
            <h3>{{ t('about.title-memo') }}</h3>
            <p v-html="t('about.memo-description')"></p>
            <div class="footer">
                <p class="version">{{ t('about.version', { version, date }) }}</p>
                <p class="sources" v-html="t('about.sources')"></p>
                <template v-if="!isSSR && tracker && settings.matomo.enabled">
                    <p v-html="t('about.optout')" />
                    <div v-if="tracker && !tracker.isUserOptedOut()" @click="tracker.optUserOut()">{{ t('about.optout-button') }}</div>
                    <div v-else>{{ t('about.optout-done') }}</div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped lang="sass">
.about
  width: 90vw
  max-width: 400px
  margin: 0 auto

.memo-img
  width: 100%

.fdc-logo
  width: 90vw
  max-width: 400px

p
  text-align: justify

.list
  text-align: left
  display: flex
  align-content: center
  flex-direction: column
  align-items: center

.footer
  margin: 0.5rem 0
  font-size: small

.version
  margin: 0
  font-size: small

.sources
  margin: 0
  font-size: small
</style>

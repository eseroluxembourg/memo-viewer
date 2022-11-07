'use strict';
import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import langs from '@/data/langs.json';
import meta from '@/utils/meta-vue3';

export const DEFAULT_FALLBACK_LOCALE = 'en-GB';

function fallbackLocale(locale) {
  return locale.split('-')[0];
}

function selectLanguage() {
  const pathname = window.location.pathname.replace(/^\/memo/, '');
  let urlCode = pathname.replace(/^\/([^/]+).*/i, '$1');

  if (urlCode === 'en') urlCode = 'en-GB';
  else if (urlCode === 'fr') urlCode = 'fr-FR';

  // Detect fr-FR
  if (langs.find((l) => l.code === urlCode)) return urlCode;

  {
    const lang = langs.find((l) => fallbackLocale(l.code) === urlCode); // Redirect (url_code=)fr  to fr-FR
    if (lang) return lang.code;
  }

  const navigatorLanguages = navigator.languages; // [fr, fr-FR]
  for (let k = 0; k < navigatorLanguages.length; ++k) {
    if (langs.find((l) => l.code == navigatorLanguages[k]))
      return navigatorLanguages[k];
  }

  for (let k = 0; k < navigatorLanguages.length; ++k) {
    const lang = langs.find(
      (l) => fallbackLocale(l.code) == navigatorLanguages[k]
    );
    if (lang) return lang.code;
  }

  return DEFAULT_FALLBACK_LOCALE;
}

export const initLocale = selectLanguage();

const loadedLanguages = [initLocale];

const loadMessages = function (lang) {
  const messages = require(/* webpackChunkName: "i18n-[request]" */ `@/i18n/${lang}/main.json`);
  messages[
    'local'
  ] = require(/* webpackChunkName: "i18n-[request]" */ `@/i18n/${lang}/local.json`);
  messages[
    'cards'
  ] = require(/* webpackChunkName: "i18n-[request]" */ `@/i18n/${lang}/cards.json`);
  messages[
    'links'
  ] = require(/* webpackChunkName: "i18n-[request]" */ `@/i18n/${lang}/links.json`);
  return messages;
};

const messages = { [initLocale]: loadMessages(initLocale) };

if (initLocale != DEFAULT_FALLBACK_LOCALE) {
  loadedLanguages.push(DEFAULT_FALLBACK_LOCALE);
  messages[[DEFAULT_FALLBACK_LOCALE]] = loadMessages(DEFAULT_FALLBACK_LOCALE);
}

export const i18n = createI18n({
  locale: initLocale,
  fallbackLocale: DEFAULT_FALLBACK_LOCALE,
  // silentFallbackWarn: true,
  messages: messages,
});

//=================================================================================================================

export const loadLanguage = async (lang) => {
  // requested lang is already the current locale
  if (i18n.locale === lang) {
    return;
  }

  // requested lang is not available
  const isLangAvailable = langs.find((l) => l.code === lang);
  if (!isLangAvailable) {
    return;
  }

  // load locale if needed
  if (!loadedLanguages.includes(lang)) {
    const messages = loadMessages(lang);
    i18n.global.setLocaleMessage(lang, messages);
    loadedLanguages.push(lang);
  }

  meta.setOgLocale(document, lang);

  // set locale globally
  i18n.global.locale = lang;
  return nextTick();
};

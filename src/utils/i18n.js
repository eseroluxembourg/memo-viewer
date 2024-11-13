'use strict';
import { nextTick } from 'vue';
import { createI18n as _createI18n } from 'vue-i18n';
import langs from '@/data/langs.json';
import settings from '../../settings.json';
import _set from 'lodash.set';

// Source: https://levelup.gitconnected.com/how-to-load-i18n-locales-asynchronously-in-vue-3-vite-9e7301c52f19

const commonI18nModules = import.meta.glob(`@/i18n/common/*.json`);

export const DEFAULT_FALLBACK_LOCALE = (() => {
    if (langs.map((l) => l.code).includes('en-GB')) return 'en-GB';
    return langs[0].code;
})();

/**
 *  Find and return a valid lang from a list.
 * @param { String } targetLang The ideal lang (ex. fr-FR)
 * @param { Array[String] } availableLangs List of all the languages we can choose.
 *  Should be non empty
 */
export function findBestAvailableLang(targetLang, availableLangs) {
    if (availableLangs.length === 0) return undefined;

    // TODO. redirect fr-BE to fr-FR if available
    if (availableLangs.includes(targetLang)) return targetLang;

    if (availableLangs.includes(DEFAULT_FALLBACK_LOCALE)) return DEFAULT_FALLBACK_LOCALE;

    console.assert(availableLangs.length > 0, 'No available langs, woops');
    return availableLangs[0];
}

export function findBestTranslation(targetLang, translations) {
    const bestLang = findBestAvailableLang(targetLang, Object.keys(translations));
    return translations[bestLang];
}

function isLangAvailable(lang) {
    return langs.find((l) => l.code === lang);
}

function extractLanguage(locale) {
    return locale.split('-')[0];
}

function readNavigatorLanguage() {
    if (import.meta.env.SSR) return DEFAULT_FALLBACK_LOCALE;

    const navigatorLanguages = navigator.languages; // [fr, fr-FR]
    for (let k = 0; k < navigatorLanguages.length; ++k) {
        if (langs.find((l) => l.code == navigatorLanguages[k])) return navigatorLanguages[k];
    }

    for (let k = 0; k < navigatorLanguages.length; ++k) {
        const lang = langs.find((l) => extractLanguage(l.code) == navigatorLanguages[k]);
        if (lang) return lang.code;
    }

    return DEFAULT_FALLBACK_LOCALE;
}

export function guessLanguage(lang) {
    if (!lang) return readNavigatorLanguage();

    if (isLangAvailable(lang)) return lang;

    // Detect if lang is "fr"
    const availableLang = langs.find((l) => extractLanguage(l.code) === lang); // Redirect (url_code=)fr  to fr-FR
    if (availableLang) return availableLang.code;

    return DEFAULT_FALLBACK_LOCALE;
}

const loadMessages = async function (lang) {
    const commonModule = await commonI18nModules[`/src/i18n/common/${lang}.json`]();
    const messages = JSON.parse(JSON.stringify(commonModule.default));
    if (settings['i18n'] !== undefined && settings['i18n'][lang] !== undefined) {
        for (const k of Object.keys(settings['i18n'][lang])) {
            _set(messages, k, settings['i18n'][lang][k]);
        }
    }
    return messages;
};

export async function createI18n() {
    const i18n = _createI18n({
        fallbackLocale: DEFAULT_FALLBACK_LOCALE,
        silentFallbackWarn: true,
        silentTranslationWarn: true,
        legacy: false,
    });

    await loadLanguage(i18n, DEFAULT_FALLBACK_LOCALE);

    return i18n;
}

export async function loadLanguage(i18n, lang) {
    // requested lang is already the current locale
    if (i18n.global.locale === lang) {
        return;
    }
    // requested lang is not available
    if (!isLangAvailable(lang)) {
        console.assert(false, `No langs available while loading ${lang}`);
        return;
    }

    // load locale if needed
    if (!i18n.global.messages[lang]) {
        const messages = await loadMessages(lang);
        i18n.global.setLocaleMessage(lang, messages);
    }

    i18n.global.locale.value = lang;
    return nextTick();
}

export function languageString(i18n) {
    const lang = langs.find((l) => l.code === i18n);
    if (lang !== undefined && lang['language'] !== undefined && lang['country'] === '') return `${lang['language']}`;
    if (lang !== undefined && lang['language'] !== undefined && lang['country'] !== undefined) return `${lang['language']} (${lang['country']})`;
    return i18n;
}

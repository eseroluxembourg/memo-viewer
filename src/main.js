import { createPinia } from 'pinia';
import { createSSRApp } from 'vue';

import App from './App.vue';
import { createRouter } from '@/router';
import { useMetaStore } from '@/stores/meta';

import { createI18n, loadLanguage } from '@/utils/i18n';
import LazyLoadDirective from '@/directives/LazyLoadDirective';
import '@/assets/styles/local.scss';

// import variants from '@/../variants.json';
import _variants from '@/../variants.json';
const defaultVersion = "v9.0";
const variants = {};
variants[defaultVersion] = _variants[defaultVersion];

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export async function createApp() {
    const app = createSSRApp(App);
    const pinia = createPinia();
    const i18n = await createI18n({
        legacy: false,
    });
    const router = createRouter(i18n);

    app.use(i18n);
    app.use(pinia);
    app.use(router);
    app.directive('lazyload', LazyLoadDirective);

    router.beforeEach((to, from, next) => {
        const metaStore = useMetaStore();
        if (to.params.lang !== '' && to.params.lang !== from.params.lang) {
            loadLanguage(i18n, to.params.lang);
            metaStore.setOgLocale(to.params.lang);
        }

        // We cannot redirect lang here due to ssr issues
        // i18n redirectionis done in app.vue

        if (to.params.version === undefined || to.params.version === '') {
            for (const variant in variants) {
                if (!variants[variant].default) continue;
                return next({ name: to.name, params: { ...to.params, version: variant } });
            }
            return next({ name: to.name, params: { ...to.params, version: Object.keys(variants)[0] } });
        }

        if (variants[to.params.version].langs[to.params.lang] === undefined) {
            for (const variant in variants) {
                if (variants[variant].langs[to.params.lang] === undefined) continue;
                metaStore.addMessage(
                    'warning',
                    'alerts.undefined-variant-redirection',
                    { oldVariant: to.params.version, lang: to.params.lang, newVariant: variant },
                    10000,
                );

                return next({ name: to.name, params: { ...to.params, version: variant } });
            }
        }
        if (to.params.version !== from.params.version || to.params.lang !== from.params.lang) {
            metaStore.eraseMessageByContent('alerts.deprecated');
            if (variants[to.params.version].deprecated) {
                let defaultVariant = undefined;
                for (const variant in variants) {
                    if (variants[variant].default) {
                        defaultVariant = variant;
                        break;
                    }
                    defaultVariant = variant;
                }
                metaStore.addMessage(
                    'error',
                    'alerts.deprecated',
                    {
                        variant: to.params.version,
                        href: router.resolve({ name: to.name, params: { ...to.params, version: defaultVariant } }).fullPath,
                    },
                    -1,
                );
            }
        }
        return next();
    });

    app.config.globalProperties.$useSSR = import.meta.env.SSR;

    return { app, router, pinia, i18n };
}

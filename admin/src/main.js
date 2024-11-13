import { createPinia } from 'pinia';
import { createSSRApp } from 'vue';

import './style.css';
import App from './App.vue';
import './index.css';

import { createRouter } from '@/router.js';
import { createI18n, loadLanguage } from '!/src/utils/i18n';

export async function createApp() {
    const app = createSSRApp(App);

    const pinia = createPinia();
    const i18n = await createI18n({
        legacy: false,
    });
    const router = createRouter();

    app.use(router);
    app.use(pinia);
    app.use(i18n);

    router.beforeEach((to, from, next) => {
        if (to.params.lang !== from.params.lang) {
            loadLanguage(i18n, to.params.lang);
        }
        next();
    });

    app.config.globalProperties.$useSSR = import.meta.env.SSR;

    return { app, router, pinia, i18n };
}

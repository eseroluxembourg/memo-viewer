import { createApp } from './main';

/*
import { matomoOptions, VueMatomo, matomoEnabled } from '@/utils/matomo';
*/

(async () => {
    const { app, router, pinia } = await createApp();
    router.isReady().then(() => {
        /*if (matomoEnabled) {
            app.use(VueMatomo, matomoOptions(router));
        }*/

        if (window.__INITIAL_STATE__ !== '<pinia-store>') pinia.state.value = window.__INITIAL_STATE__;

        app.mount('#app');
    });
})();
// https://github.com/iPrytz/vue3-pinia-ssr-example/blob/master/src/entry-server.mjs
// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/package.json
// })

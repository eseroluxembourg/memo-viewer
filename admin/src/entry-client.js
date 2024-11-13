import { createApp } from './main';

(async () => {
    const { app, router } = await createApp();
    router.isReady().then(() => {
        // if (window.__INITIAL_STATE__ !== '<pinia-store>') pinia.state.value = window.__INITIAL_STATE__;

        app.mount('#app');
    });
})();
// https://github.com/iPrytz/vue3-pinia-ssr-example/blob/master/src/entry-server.mjs
// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/package.json
// })

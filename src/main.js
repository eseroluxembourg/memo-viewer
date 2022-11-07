import { createApp } from 'vue';
import App from '@/App.vue';
import { router } from '@/router';

import { i18n } from '@/utils/i18n';
import { matomoOptions, VueMatomo, matomoEnabled } from '@/utils/matomo';
import '@/assets/styles/local.scss';
import '@/assets/styles/main.scss';

let app = createApp(App).use(i18n).use(router);

if (matomoEnabled) {
  app = app.use(VueMatomo, matomoOptions);
}
app.config.globalProperties.$baseUrl = process.env.BASE_URL;

app.mount('#app');

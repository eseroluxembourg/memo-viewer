import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cardsPlugin from './vite/vite-plugin-cards.js';
import pagesPlugin from './vite/vite-plugin-pages.js';
import markdownPlugin from './vite/vite-plugin-markdown.js';
import assetsPlugin from './vite/vite-plugin-assets.js';
import eslint from 'vite-plugin-eslint';

const plugins = [vue(), eslint(), cardsPlugin(), markdownPlugin(), pagesPlugin(), assetsPlugin()];

// https://vitejs.dev/config/
export default defineConfig(() => {
    const settings = JSON.parse(fs.readFileSync('settings.json'));
    return {
        define: {
            __VUE_I18N_FULL_INSTALL__: true,
            // __VUE_I18N_LEGACY_API__: false,
            __INTLIFY_PROD_DEVTOOLS__: false,
            __CARDS_URL_PREFIX__: JSON.stringify(fs.existsSync('public/cards') ? '' : settings.host),
            __TODAY__: JSON.stringify(process.env.TODAY),
        },
        plugins,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: ` // just variables loaded globally
            @import "./src/assets/styles/local.scss";
            @import "./src/assets/styles/main.scss";
            `,
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            watch: {
                ignored: ['dist/'],
            },
        },
        optimizeDeps: {
            exclude: ['dist'],
        },
    };
});

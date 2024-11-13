import { defineStore } from 'pinia';
import meta from '@/utils/meta-vue3';
import { useI18nStore } from '@/stores/i18n.js';

import { host } from '@/../settings.json';

export const useMetaStore = defineStore('meta', {
    state: () => {
        return {
            title: '',
            description: '',
            image: '',
            locale: '',
            url: '',
            siteName: '',
            messages: [],
            messageIndex: 0,
        };
    },
    getters: {
        metaTags: (state) => {
            return {
                '<og:title>': state.title,
                '<twitter:title>': state.title,
                '<!--title-->': state.title,

                '<description>': state.description,
                '<twitter:description>': state.description,
                '<og:description>': state.description,

                '<lang>': state.locale,
                '<og:type>': 'website',
                '<og:image>': host + state.image,
                '<twitter:card>': 'summary_large_image',
                '<twitter:image>': host + state.image,
                '<og:locale>': state.locale,
                '<og:site_name>': state.siteName,
                '<og:url>': host + state.url,
            };
        },
    },
    actions: {
        setTitle(title) {
            this.title = title;
            meta.setTitle(title);
        },
        setDescription(description) {
            this.description = description;
            meta.setDescription(description);
        },
        setImage(imageUrl) {
            this.image = imageUrl;
        },
        setOgLocale(locale) {
            this.locale = locale;
            meta.setOgLocale(locale);
            const i18nStore = useI18nStore();
            this.siteName = i18nStore.label('title', locale);
            meta.setOgSiteName(this.siteName);
        },
        setOgUrl(url) {
            this.url = url;
            meta.setOgUrl(url);
        },
        addMessage(type, i18nKey, params, timeout) {
            const messageId = this.messageIndex;
            this.messages.push({
                type,
                i18nKey,
                params,
                timeout,
                id: messageId,
            });
            if (timeout > 0) {
                setTimeout(() => this.eraseMessage(messageId), timeout);
            }
            ++this.messageIndex;
        },
        eraseMessage(messageId) {
            const index = this.messages.findIndex((message) => message.id === messageId);
            if (index < 0) return;
            this.messages.splice(index, 1);
        },
        eraseMessageByContent(messageContent) {
            const index = this.messages.findIndex((message) => message.i18nKey === messageContent);
            if (index < 0) return;
            this.messages.splice(index, 1);
        },
    },
});

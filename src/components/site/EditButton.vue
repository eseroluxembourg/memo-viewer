<template>
    <div>
        <p
            v-if="header && targetLang !== choosenLang"
            class="missing-translation contribution-box"
            v-html="$t('contribute.translate-explanations', { href: fileSourceUrl, mail: settings.contact })"></p>
        <template v-if="!header && targetLang === choosenLang">
            <hr />
            <p
                class="contribute contribution-box"
                v-html="$t('contribute.contribute-explanations', { href: fileSourceUrl, mail: settings.contact })"></p>
        </template>
    </div>
</template>

<script>
import settings from '@/../settings.json';

export default {
    name: 'EditButton',
    data: () => ({
        settings,
    }),
    props: {
        targetLang: String,
        choosenLang: String,
        fileSourceUrl: String,
        header: Boolean,
    },
};
</script>
<style scoped lang="scss">
.contribution-box {
    &.missing-translation {
        margin-left: 0px;
        font-style: italic;
        border-left: 3px solid var(--primary);
        padding-left: 10px;
        padding-top: 3px;
        padding-bottom: 3px;
    }

    &.contribute {
    }

    font-style: italic;
}
</style>

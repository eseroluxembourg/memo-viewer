<script setup>
import { useFreskStore } from '@/stores/fresks.js';
import { findBestTranslation } from '@/utils/i18n';

const freskStore = useFreskStore();
</script>

<template>
    <div v-if="freskStore.usedLinksStyle(freskId).length > 0" class="caption">
        <ul>
            <li v-for="(cls, index) in freskStore.usedLinksStyle(freskId)" :key="index">
                <span class="arrow" :style="style(cls)">
                    {{ cls.dashes ? '⇢' : '→' }}
                </span>
                {{ findBestTranslation($i18n.locale, cls.$label) }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        freskId: String,
    },
    computed: {
        style: () => {
            return (cls) => {
                return {
                    color: 'var(--primary)',
                    ...cls,
                };
            };
        },
    },
};
</script>

<style scoped lang="scss">
.caption {
    z-index: 10;
    font-size: small;
    background: #efeeee;
    padding: 15px;
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: left;
    border: 2px solid var(--primary);
    border-top-left-radius: 5%;
    border-right: none;
    border-bottom: none;
    h3 {
        margin-top: 0px;
        margin-bottom: 5px;
        color: var(--primary);
        font-size: normal;
    }
    ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }
}
.arrow {
    font-size: medium;
}
</style>

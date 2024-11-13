<script setup>
import { useMetaStore } from '@/stores/meta';

import { InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
const metaStore = useMetaStore();
</script>
<template>
    <div class="alerts-container">
        <div v-for="(message, index) in metaStore.messages" :key="index" role="alert" class="alert">
            <InformationCircleIcon />
            <span v-html="$t(message.i18nKey, message.params)"></span>
            <button @click="metaStore.eraseMessage(message.id)">
                <XCircleIcon />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AlertsComponent',
};
</script>
<style lang="scss" scoped>
.alerts-container {
    position: fixed;
    bottom: 15px;
    left: 15px;
    z-index: 99;
    width: calc(100% - 30px);

    @media only screen and (max-width: 480px) {
        & {
            bottom: 0;
            left: 0px;
            width: calc(100%);
        }
    }

    .alert {
        position: relative;
        @media only screen and (max-width: 480px) {
            & {
                border: unset;
                border-top: 2px solid var(--primary);
                border-radius: 0px;
            }
        }

        display: flex;
        background: white;
        color: var(--primary);
        margin: 0.9rem 1rem;
        padding: 0.5rem;
        border-radius: 5px;
        border: 2px solid var(--primary);
        justify-content: center;

        svg {
            display: block;
            height: 25px;
            width: 25px;
        }
        span {
            margin: auto 0;
        }

        button {
            background: none;
            border: none;
            position: absolute;
            right: 0;
            color: var(--primary);
            &:hover {
                color: var(--secondary);
            }
        }
    }
}
</style>

<script setup>
import { useVariantsStore } from '@/store/variants';
import { useGitlabStore } from '@/store/gitlab';

const variantsStore = useVariantsStore();
const gitlabStore = useGitlabStore();
variantsStore.fetchVariants();
</script>

<template>
    <div class="container mx-auto">
        <h1 class="text-3xl font-semibold text-gray-900 mb-3">{{ $t('ci.label') }}</h1>

        <div class="form-control w-full mb-8">
            <label class="label">
                <span class="label-text">Indique le trigger token</span>
            </label>
            <input type="text" placeholder="glptt-xxxxx" class="input input-bordered w-full" v-model="gitlabTriggerToken" />
        </div>

        <h2 class="text-2xl font-semibold text-gray-900">{{ $t('ci.cardslabel') }}</h2>

        <table class="table">
            <!-- head -->
            <thead>
                <tr class="text-center">
                    <th class="max-w-[150px] whitespace-normal">Variante</th>
                    <th class="max-w-[100px] whitespace-normal">Langue</th>
                    <th class="max-w-[100px] whitespace-normal"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="variantsStore.loading">
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th><span class="loading loading-dots loading-md"></span></th>
                </tr>
                <tr v-else v-for="(row, key) in rows" :key="key">
                    <td class="text-center">{{ row['variant'] }}</td>
                    <td class="text-center">{{ row['lang'] }}</td>
                    <td>
                        <button
                            class="btn btn-xs"
                            @click="gitlabStore.triggerCI({ GENERATE_CARDS: 'true', VARIANT: row['variant'], LANG: row['lang'] })">
                            Générer
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'CIPage',
    data() {
        return {};
    },
    computed: {
        gitlabTriggerToken: {
            get: function () {
                const gitlabStore = useGitlabStore();
                gitlabStore.listPipelines('generate');
                return gitlabStore.gitlabTriggerToken;
            },
            set: function (newValue) {
                const gitlabStore = useGitlabStore();
                gitlabStore.setGitlabTrigerToken(newValue);
            },
        },
        rows() {
            const _rows = [];
            const variantsStore = useVariantsStore();
            for (const variantId of variantsStore.variantIds) {
                const variant = variantsStore.variant(variantId);
                for (const lang of Object.keys(variant.langs)) {
                    _rows.push({
                        variant: variant.id.value,
                        lang: lang,
                    });
                }
            }
            return _rows;
        },
    },
};
</script>

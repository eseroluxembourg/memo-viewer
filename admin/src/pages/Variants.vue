<script setup>
import SortByButton from '@/components/SortByButton.vue';
import { useVariantsStore } from '@/store/variants';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

const variantsStore = useVariantsStore();

const orderedBy = ref({ field: undefined, direction: 1 });
const loading = ref(true);

const variants = computed(() => {
    return variantsStore.variantIds.map((variantId) => {
        const variant = variantsStore.variant(variantId);
        return {
            _id: variantId,
            nbLangs: Object.keys(variant.langs).length,
            changed: false, //cardsStore.changed(variantId),
            new: false, // not supported
            removed: false, // not supported,
            fetched: variant.fetched,
            ...variant,
        };
    });
});

const orderedVariants = computed(() => {
    if (orderedBy.value.field === undefined) return variants.value;
    const field = orderedBy.value.field;

    return [...variants.value].sort((variantA, variantB) => {
        return orderedBy.value.direction > 0 ? variantA[field] < variantB[field] : variantB[field] < variantA[field];
    });
});

const createVariant = () => {
    variantsStore.createVariant().then((variantId) => {
        router.push({ name: 'RouteVariant', params: { variantId: variantId } });
    });
};

onMounted(() => {
    variantsStore.fetchVariants().then(() => (loading.value = false));
});
</script>

<template>
    <div class="container mx-1 p-10 max-w-4xl" v-if="!loading">
        <h1 class="text-3xl font-semibold text-gray-900 pb-4">{{ t('variants.label') }}</h1>

        <div>
            <div class="btn btn-success btn-xs btn-outline" @click="createVariant">{{ t('variant.create') }}</div>
        </div>

        <table class="table">
            <!-- head -->
            <thead>
                <tr class="text-center">
                    <th class="max-w-[150px] whitespace-normal">
                        {{ t('common.id') }}<br />
                        <SortByButton field="id" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        {{ t('common.languages') }}<br />
                        <SortByButton field="nbLangs" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        Version par défaut<br />
                        <SortByButton field="default" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        Version dépréciée<br />
                        <SortByButton field="deprecated" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[120px] whitespace-normal">
                        {{ t('common.changes') }}<br />
                        <SortByButton field="changed" v-model="orderedBy" />
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="variantsStore.loading">
                    <td><span class="loading loading-dots loading-md"></span></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-else v-for="(variant, key) in orderedVariants" :key="key">
                    <td>{{ variant._id }}</td>
                    <td class="max-w-[100px] whitespace-normal">
                        <div v-if="variant.fetched" class="tooltip" :data-tip="t('common.translated', { nb: variant.nbLangs })">
                            <progress class="progress w-[100px]" :value="variant.nbLangs" :max="10" />
                        </div>
                        <div v-else class="btn btn-ghost btn-circle btn-xs" @click="variantsStore.fetchVariant(variant._id)">?</div>
                    </td>
                    <td>
                        {{ variant.default ? '✔️' : '✖️' }}
                    </td>
                    <td>
                        {{ variant.deprecated ? '✔️' : '✖️' }}
                    </td>
                    <td>
                        <span v-if="variantsStore.changed(variant._id)">👍</span>
                    </td>
                    <td>
                        <router-link class="link" :to="{ name: 'RouteVariant', params: { variantId: variant._id, lang: locale } }">{{
                            t('common.edit')
                        }}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

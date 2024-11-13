<script setup>
import SortByButton from '@/components/SortByButton.vue';
import { useFresksStore } from '@/store/fresks';
import { useVariantsStore } from '@/store/variants';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();
const fresksStore = useFresksStore();
const variantsStore = useVariantsStore();

const orderedBy = ref({ field: undefined, direction: 1 });

const fresks = computed(() => {
    return fresksStore.freskIds.map((freskId) => {
        const fresk = fresksStore.fresk(freskId);
        return {
            _id: freskId,
            changed: fresksStore.changed(freskId),
            new: false, // not supported
            removed: false, // not supported,
            fetched: fresk.fetched,
            ...fresk,
        };
    });
});

const orderedFresks = computed(() => {
    if (orderedBy.value.field === undefined) return fresks.value;
    const field = orderedBy.value.field;

    return [...fresks.value].sort((freskA, freskB) => {
        if (freskA[field].value !== undefined) {
            return orderedBy.value.direction > 0 ? freskA[field].value < freskB[field].value : freskB[field].value < freskA[field].value;
        }
        return orderedBy.value.direction > 0 ? freskA[field] < freskB[field] : freskB[field] < freskA[field];
    });
});

const createFresk = () => {
    fresksStore.createFresk().then((freskId) => {
        router.push({ name: 'RouteFresk', params: { freskId: freskId } });
    });
};

onMounted(() => {
    fresksStore.fetchFresks();
    variantsStore.fetchVariants();
});
</script>

<template>
    <div class="container mx-1 p-10 max-w-4xl">
        <h1 class="text-3xl font-semibold text-gray-900 pb-4">{{ t('fresks.label') }}</h1>

        <div>
            <div class="btn btn-success btn-xs btn-outline" @click="createFresk">{{ t('fresk.create') }}</div>
        </div>

        <table class="table">
            <!-- head -->
            <thead>
                <tr class="text-center">
                    <th class="max-w-[150px] whitespace-normal">
                        {{ t('common.id') }}<br />
                        <SortByButton field="id" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[150px] whitespace-normal">
                        Lot<br />
                        <SortByButton field="lot" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[150px] whitespace-normal">Versions<br /></th>
                    <th class="max-w-[120px] whitespace-normal">
                        {{ t('common.changes') }}<br />
                        <SortByButton field="changed" v-model="orderedBy" />
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="fresksStore.loading">
                    <td><span class="loading loading-dots loading-md"></span></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr v-else v-for="(fresk, key) in orderedFresks" :key="key">
                    <td>{{ fresk._id }}</td>
                    <td class="text-center">
                        {{ fresk.lot !== undefined && fresk.lot.value }}
                    </td>
                    <td v-if="!variantsStore.loading && fresk.fetched">
                        <div
                            v-for="(variant, key) in fresk.variants.value"
                            :key="key"
                            class="badge m-1 badge-xs border-none px-[0.5rem] tooltip tooltip-top"
                            :data-tip="variant"
                            :style="{ 'background-color': variantsStore.variant(variant).color.value, 'border-color': 'white' }"></div>
                    </td>
                    <td v-else></td>
                    <td>
                        <div v-if="fresk.removed" class="tooltip tooltip-top" :data-tip="t('fresk.removed')">❌</div>
                        <div v-else-if="fresk.new" class="tooltip tooltip-top" :data-tip="t('fresk.added')">➕</div>
                        <div v-else-if="fresk.changed" class="tooltip tooltip-top" :data-tip="t('fresk.changed')">👍</div>
                    </td>
                    <td>
                        <router-link class="link" :to="{ name: 'RouteFresk', params: { freskId: fresk._id, lang: locale } }">{{
                            t('common.edit')
                        }}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

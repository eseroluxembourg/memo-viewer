<script setup>
import { ArrowUturnLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import UndoField from '@/components/UndoField.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import LangSelect from '@/components/LangSelect.vue';
import PreviewCard from '@/components/PreviewCard.vue';
import { useLinksStore } from '@/store/links';
import { useCardsStore } from '@/store/cards';
import { useVariantsStore } from '@/store/variants';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const props = defineProps({
    linkId: {
        type: String,
        required: true,
    },
});

const linksStore = useLinksStore();
const cardsStore = useCardsStore();
const variantsStore = useVariantsStore();

const activeLang = ref(undefined);
const loading = ref(false);

const isNew = computed(() => linksStore.isNew(props.linkId));

const link = computed(() => {
    const lk = linksStore.link(props.linkId);
    if (lk === undefined || !lk.fetched || variantsStore.loading) return undefined;
    return lk;
});

const fromCardId = computed({
    get() {
        cardsStore.prefetchCard(link.value.fromCardId.value);
        return link.value.fromCardId.value;
    },
    set(value) {
        linksStore.setModification(props.linkId, undefined, 'fromCardId', value);
    },
});

const toCardId = computed({
    get() {
        cardsStore.prefetchCard(link.value.toCardId.value);
        return link.value.toCardId.value;
    },
    set(value) {
        linksStore.setModification(props.linkId, undefined, 'toCardId', value);
    },
});

const linkStatus = computed({
    get() {
        return link.value.status.value;
    },
    set(value) {
        linksStore.setModification(props.linkId, undefined, 'status', value);
    },
});

const linkExplanation = computed({
    get() {
        if (link.value.explanations[activeLang.value] !== undefined) return link.value.explanations[activeLang.value].value;
        return '';
    },
    set(value) {
        linksStore.setModification(props.linkId, activeLang.value, 'explanations', value);
    },
});

const linkRemoved = computed({
    get() {
        if (link.value.removed === undefined) return false;
        return link.value.removed.value;
    },
    set(value) {
        linksStore.setModification(props.linkId, undefined, 'removed', value);
    },
});

onMounted(() => {
    linksStore.fetchLink(props.linkId);
    cardsStore.fetchCards();
    variantsStore.fetchVariants();
});

watch(
    () => route.params.linkId,
    (newVal) => {
        linksStore.fetchLink(newVal);
    },
);

const removeTemporaryLink = () => {
    loading.value = true;
    linksStore.setModification(props.linkId, undefined, undefined, undefined);
    router.push({ name: 'RouteLinks' });
};

const createLink = () => {
    linksStore.createLink().then((linkId) => {
        router.push({ name: 'RouteLink', params: { ...route.params, linkId: linkId } });
    });
};
</script>

<template>
    <div class="container mx-auto">
        <form v-if="link !== undefined && !loading" class="px-10">
            <div class="flex justify-between">
                <router-link
                    :to="{ name: 'RouteLink', params: { lang: locale, linkId: linksStore.previousLinkId(props.linkId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    <ChevronLeftIcon class="w-4 h-4" />{{ t('link.previous') }}
                </router-link>

                <button class="btn btn-ghost text-xs" @click="createLink">{{ t('link.create') }}</button>

                <router-link
                    :to="{ name: 'RouteLink', params: { lang: locale, linkId: linksStore.nextLinkId(props.linkId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    {{ t('link.next') }} <ChevronRightIcon class="w-4 h-4" />
                </router-link>
            </div>

            <h1 class="text-3xl font-semibold text-gray-900">{{ t('link.label', { linkId: link.id.value }) }}</h1>
            <template v-if="!isNew">
                <div>
                    <label class="label">
                        <span class="label-text" v-if="!linkRemoved">{{ t('link.remove') }}</span>
                        <span class="label-text" v-else>{{ t('common.undo') }}</span>
                    </label>
                    <input type="checkbox" class="toggle toggle-error" v-model="linkRemoved" />
                </div>
                <div v-if="linkRemoved">
                    <p class="text-center">{{ t('link.removed-warning') }}</p>
                </div>
            </template>
            <template v-else>
                <div class="btn btn-error btn-xs btn-outline" @click="removeTemporaryLink">
                    <ArrowUturnLeftIcon class="w-4 h-4" />
                    {{ t('link.undo-create') }}
                </div>
            </template>
            <div v-if="!linkRemoved" class="form-control w-full grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-9">
                <div class="col-start-0 col-span-3 md:col-span-2">
                    <label class="label">
                        <span class="label-text">{{ t('link.fromcard') }}</span>
                    </label>
                    <div class="join w-full">
                        <select class="select select-bordered join-item text-ellipsis w-full" v-model="fromCardId">
                            <option v-for="(card, key) in cardsStore.cards" :key="key" :value="card.id" class="text-ellipsis overflow-clip">
                                {{ card.id }}: {{ cardsStore.cardTitleForDisplay(card.id, locale) }}
                            </option>
                        </select>
                        <PreviewCard
                            class="join-item"
                            :imageUrl="cardsStore.cardImage(fromCardId, locale, cardsStore.cardVariantForDisplay(fromCardId, locale), 'front')" />
                    </div>
                </div>

                <UndoField v-if="!isNew && link.fromCardId.changed" class="col-span-1" @click="fromCardId = undefined" />

                <div class="col-span-3 md:col-span-2 col-start-1 md:col-start-4">
                    <label class="label">
                        <span class="label-text">{{ t('link.tocard') }}</span>
                    </label>
                    <div class="join w-full">
                        <select class="join-item select select-bordered overflow-clip w-full" v-model="toCardId">
                            <option v-for="(card, key) in cardsStore.cards" :key="key" :value="card.id" class="overflow-clip text-ellipsis">
                                {{ card.id }}: <span class="text-ellipsis">{{ cardsStore.cardTitleForDisplay(card.id, undefined) }}</span>
                            </option>
                        </select>
                        <PreviewCard
                            class="join-item"
                            :imageUrl="cardsStore.cardImage(toCardId, locale, cardsStore.cardVariantForDisplay(toCardId, locale), 'front')" />
                    </div>
                </div>
                <UndoField v-if="!isNew && link.toCardId.changed" class="col-span-1 col-start-4 md:col-start-6" @click="toCardId = undefined" />

                <div class="col-span-3 md:col-span-2 col-start-1 md:col-start-7">
                    <label class="label">
                        <span class="label-text">{{ t('link.status') }}</span>
                    </label>
                    <select class="select select-bordered w-full" v-model="linkStatus">
                        <option v-for="(status, key) in linksStore.statusList" :key="key" :value="status">{{ status }}</option>
                    </select>
                </div>
                <UndoField v-if="!isNew && link.status.changed" class="col-span-1 col-start-4 md:col-start-9" @click="linkStatus = undefined" />

                <div class="divider w-full col-span-2 md:col-start-3 col-start-2 md:col-span-5"></div>

                <div class="col-span-4">
                    <label class="label">
                        <span class="label-text">{{ t('common.langToEdit') }}</span>
                    </label>
                    <LangSelect :langs="link.langs" :availableLangs="cardsStore.langs" v-model="activeLang" />
                </div>

                <template v-if="activeLang !== undefined">
                    <MarkdownEditor
                        class="md:col-span-8 col-span-4"
                        :label="t('link.explanations')"
                        v-model="linkExplanation"
                        :accent="link.explanations[activeLang] !== undefined && link.explanations[activeLang].changed" />
                    <UndoField
                        v-if="!isNew && link.explanations[activeLang] !== undefined && link.explanations[activeLang].changed"
                        class="col-span-1"
                        @click="linkExplanation = undefined" />
                </template>
            </div>
        </form>
        <div v-else>
            <span class="loading loading-dots loading-md"></span>
        </div>
    </div>
</template>

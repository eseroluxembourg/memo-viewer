<script setup>
import { useVariantsStore } from '@/store/variants';
import { useCardsStore } from '@/store/cards';
import { ref, computed } from 'vue';

import UndoField from '@/components/UndoField.vue';
import LangSelect from '@/components/LangSelect.vue';

const variantsStore = useVariantsStore();
const cardsStore = useCardsStore();

variantsStore.fetchVariants();

const activeLang = ref(undefined);

const props = defineProps({
    variantId: {
        type: String,
        required: true,
    },
});

const variant = computed(() => {
    return variantsStore.variant(props.variantId);
});

const deprecated = computed({
    get() {
        return variant.value.deprecated.value;
    },
    set(value) {
        variantsStore.setModification(props.variantId, undefined, 'deprecated', undefined, value);
    },
});

const defaultVariant = computed({
    get() {
        return variant.value.default.value;
    },
    set(value) {
        variantsStore.setModification(props.variantId, undefined, 'default', undefined, value);
    },
});

const pdfUrl = computed({
    get() {
        if (variant.value.langs[activeLang] === undefined) return '';
        return variant.value.langs[activeLang].value.url;
    },
    set(value) {
        variantsStore.setModification(props.variantId, activeLang, 'langs', 'url', value);
    },
});

const pdfFormat = computed(() => {
    if (variant.value.langs[activeLang] === undefined) return '';
    return variant.value.langs[activeLang].value.format;
});

const pdfReplacements = computed(() => {
    if (variant.value.langs[activeLang] === undefined) return '';
    return variant.value.langs[activeLang].value.replacements;
});
</script>

<template>
    <div class="container mx-auto">
        <form class="px-10" v-if="!variantsStore.loading">
            <h1 class="text-3xl font-semibold text-gray-900">{{ $t('variant.label', { variantId: variant.id.value }) }}</h1>
            <div class="form-control w-full grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8">
                <!-- Default -->
                <div class="col-span-3 tooltip tooltip-bottom" :data-tip="$t('variant.defaultTooltip')">
                    <label class="label">
                        <span class="label-text">{{ $t('variant.default') }}</span>
                        <input type="checkbox" checked="checked" className="checkbox" v-model="defaultVariant" />
                    </label>
                </div>
                <UndoField v-if="variant.default.changed" class="col-span-1" @click="defaultVariant = undefined" />

                <!-- Deprecated -->
                <div class="col-span-3 col-start-1 md:col-start-5 tooltip tooltip-bottom" :data-tip="$t('variant.deprecatedTooltip')">
                    <label class="label">
                        <span class="label-text">{{ $t('variant.deprecated') }}</span>
                        <input type="checkbox" checked="checked" className="checkbox" v-model="deprecated" />
                    </label>
                </div>
                <UndoField v-if="variant.deprecated.changed" class="col-span-1" @click="deprecated = undefined" />

                <!-- Lang -->
                <div class="divider w-full col-span-2 md:col-start-3 col-start-2 md:col-span-4"></div>
                <div class="col-span-3 col-start-1">
                    <label class="label">
                        <span class="label-text">{{ $t('common.langToEdit') }}</span>
                    </label>
                    <LangSelect :langs="new Set(Object.keys(variant.langs))" :availableLangs="cardsStore.langs" v-model="activeLang" />
                </div>

                <!-- url -->
                <div v-if="activeLang !== undefined" class="md:col-span-7 col-span-3 col-start-1 md:col-start-1 tooltip tooltip-bottom">
                    <label class="label">
                        <span class="label-text">{{ $t('variant.pdfUrl') }}</span>
                    </label>
                    <input
                        type="text"
                        :placeholder="$t('variant.pdfUrlPlaceholder')"
                        :class="{
                            'input input-bordered w-full': true,
                            'input-accent':
                                variant.langs[activeLang] !== undefined &&
                                variant.langs[activeLang].value['url'] !== undefined &&
                                variant.langs[activeLang].value['url'].changed,
                        }"
                        v-model="pdfUrl" />
                    <p class="text-xs italic text-left mt-2">Tester l'url en <a :href="pdfUrl" target="_blank" class="underline">cliquant ici</a>.</p>
                </div>
                <!-- TODO: fixme -->
                <!-- <UndoField
                    class="col-span-1"
                    v-if="card.title[activeLang] !== undefined && card.title[activeLang].changed"
                    @click="cardTitle = undefined" /> -->

                <!-- format -->
                <div
                    v-if="activeLang !== undefined"
                    class="md:col-span-3 col-span-3 md:col-start-1 tooltip tooltip-bottom"
                    :data-tip="$t('variant.pdfFormatTooltip')">
                    <label class="label">
                        <span class="label-text">{{ $t('variant.pdfFormat') }}</span>
                    </label>
                    <select class="select select-bordered w-full" v-model="pdfFormat">
                        <option v-for="(format, index) in variantsStore.pdfFormats" :value="format" :key="index">
                            {{ format }}
                        </option>
                    </select>
                </div>

                <!-- replacements -->
                <div
                    v-if="activeLang !== undefined"
                    class="md:col-span-3 col-span-3 md:col-start-5 tooltip tooltip-bottom"
                    :data-tip="$t('variant.pdfReplacementsTooltip')">
                    <label class="label">
                        <span class="label-text">{{ $t('variant.pdfReplacements') }}</span>
                    </label>
                    <select class="select select-bordered w-full" v-model="pdfReplacements">
                        <option :value="null"></option>
                        <option v-for="(replacements, index) in variantsStore.pdfReplacements" :value="replacements" :key="index">
                            {{ replacements }}
                        </option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</template>

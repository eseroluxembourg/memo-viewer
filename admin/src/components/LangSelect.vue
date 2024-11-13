<script setup>
import { PlusIcon } from '@heroicons/vue/24/solid';
import { languageString } from '!/src/utils/i18n.js';
import { ref, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    langs: {
        type: Set,
        required: true,
    },
    availableLangs: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();

const activeLang = ref(props.modelValue);

const _langs = computed(() => {
    if (activeLang.value === undefined) return props.langs;
    if (props.langs.has(activeLang.value)) return props.langs;

    const copy = new Set(props.langs);
    copy.add(activeLang.value);
    return copy;
});

if (props.modelValue === undefined) {
    nextTick(() => {
        activeLang.value = Array.from(_langs.value)[0];
    });
}

watch(activeLang, (newVal) => {
    emit('update:modelValue', newVal);
});

watch(
    () => props.modelValue,
    (newVal) => {
        activeLang.value = newVal;
    },
    {
        immediate: true,
    },
);
</script>

<template>
    <div class="join w-full">
        <select class="select select-bordered w-full max-w-[150px] join-item" v-model="activeLang">
            <option v-for="(lang, index) in _langs" :value="lang" :key="index">
                {{ languageString(lang) }}
            </option>
        </select>
        <div class="dropdown join-item w-full max-w-[300px]">
            <label tabindex="0" class="btn join-item w-full max-w-[300px]">
                <PlusIcon class="w-4 h-4" />
                {{ t('common.newlang') }}
            </label>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] w-full bg-base-100 rounded-box overflow-scroll">
                <li v-for="(lang, key) in props.availableLangs" :key="key">
                    <span @click="emit('update:modelValue', lang)" :class="{ 'line-through': props.langs.has(lang) }">{{
                        languageString(lang)
                    }}</span>
                </li>
            </ul>
        </div>
    </div>
    <p class="w-full text-xs mt-5 italic">
        {{ t('common.langexplanation') }}
    </p>
</template>

<style scoped lang="sass"></style>

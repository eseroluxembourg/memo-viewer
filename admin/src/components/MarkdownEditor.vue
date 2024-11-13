<script setup>
import { markdownToHtml } from '@/utils/markdown.js';
import { PencilIcon, EyeIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';
</script>

<template>
    <div>
        <label class="label">
            <span class="label-text">{{ label }}</span>
            <span class="label-text-alt">
                <div :class="{ 'btn btn-ghost': true, 'btn-disabled': content === '' }" @click="editing = !editing">
                    <EyeIcon v-if="editing" class="w-4 h-4" />
                    <PencilIcon v-else class="w-4 h-4" />
                    {{ editing ? $t('common.preview') : $t('common.edit') }}
                </div>
                <div class="tooltip" :data-tip="$t('common.markdownHelp')">
                    <a class="btn btn-ghost btn-circle ml-1" href="https://memo.fresque.earth/#/admin/markdown" target="_blank">
                        <QuestionMarkCircleIcon class="w-5 h-5 rounded-full" />
                    </a>
                </div>
            </span>
        </label>
        <textarea
            v-if="editing"
            :class="{ 'textarea textarea-bordered h-48 w-full': true, 'input-accent': accent }"
            :placeholder="label"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"></textarea>
        <div
            v-else
            :class="{ 'min-h-48 w-full text-sm px-4 py-2 overflow-scroll border rounded-lg leading-7': true }"
            :innerHTML="markdownToHtml(modelValue)"></div>
    </div>
</template>

<script>
export default {
    name: 'MarkdownEditor',
    props: {
        label: String,
        modelValue: String,
        accent: Boolean,
    },
    data() {
        return {
            editing: true,
        };
    },
};
</script>

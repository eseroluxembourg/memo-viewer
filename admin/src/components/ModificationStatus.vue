<script setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';
</script>

<template>
    <div
        :class="{
            'btn btn-ghost btn-circle btn-xs': true,
            'text-primary': active && modelValue.direction === -1,
        }"
        @click="$emit('update:modelValue', { field, direction: -1 })">
        <ChevronUpIcon class="w-4 h-4" />
    </div>
    <div
        :class="{
            'btn btn-ghost btn-circle btn-xs': true,
            'text-primary': active && modelValue.direction === 1,
        }"
        @click="$emit('update:modelValue', { field, direction: 1 })">
        <ChevronDownIcon class="w-4 h-4" />
    </div>
</template>

<script>
export default {
    name: 'SortByButton',
    props: {
        field: String,
        modelValue: Object,
    },
    computed: {
        active() {
            return this.field === this.modelValue.field;
        },
    },
};
</script>

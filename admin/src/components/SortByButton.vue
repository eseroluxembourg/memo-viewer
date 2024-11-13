<script setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';
import { computed } from 'vue';

const props = defineProps({
    field: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Object,
        required: true,
    },
});

const active = computed(() => {
    return props.field === props.modelValue.field;
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div
        :class="{
            'btn btn-ghost btn-circle btn-xs': true,
            'text-primary': active.value && props.modelValue.direction === -1,
        }"
        @click="emit('update:modelValue', { field: props.field, direction: -1 })">
        <ChevronUpIcon class="w-4 h-4" />
    </div>
    <div
        :class="{
            'btn btn-ghost btn-circle btn-xs': true,
            'text-primary': active.value && props.modelValue.direction === 1,
        }"
        @click="emit('update:modelValue', { field: props.field, direction: 1 })">
        <ChevronDownIcon class="w-4 h-4" />
    </div>
</template>

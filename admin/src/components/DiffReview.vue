<script setup>
import { computed } from 'vue';
import * as Diff from 'diff';

const props = defineProps({
    oldValue: [String, Number, Boolean, Object],
    newValue: [String, Number, Boolean, Object],
    mode: {
        type: String,
        required: true,
        validator: (value) => ['new', 'old'].includes(value),
    },
});

const formatValue = (value) => {
    if (value === undefined) return '';
    if (typeof value === 'boolean' || typeof value === 'number') return value.toString();
    if (typeof value === 'object') return JSON.stringify(value, null, 4);
    return value;
};
const diff = computed(() => {
    const oldValue = formatValue(props.oldValue);
    const newValue = formatValue(props.newValue);

    return Diff.diffChars(oldValue, newValue);
});
</script>

<template>
    <div>
        <span
            v-for="(part, index) in diff.filter(
                (part) => part.added === (props.mode === 'new') || part.removed === (props.mode === 'old') || (!part.added && !part.removed),
            )"
            :key="index"
            :style="{ color: part.added ? 'green' : part.removed ? 'red' : 'grey' }">
            {{ part.value }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
// Ajoutez ici vos styles SASS si nécessaire
</style>

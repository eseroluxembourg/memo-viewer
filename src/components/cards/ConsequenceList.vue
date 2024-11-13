<script setup>
import ConsequenceCard from '@/components/cards/CardConsequence.vue';

defineProps({
    consequenceIds: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <div class="consequences-list">
        <ConsequenceCard v-for="consequenceId in consequenceIds" :key="consequenceId" :consequenceId="consequenceId" />
    </div>
</template>

<style lang="sass"></style>

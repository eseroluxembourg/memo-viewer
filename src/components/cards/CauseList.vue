<script setup>
import CardCause from '@/components/cards/CardCause.vue';

defineProps({
    title: { type: String, default: 'cause' },
    causeIds: { type: Array, required: true },
});
</script>

<template>
    <div class="causes">
        <CardCause v-for="causeId in causeIds" :key="causeId" :causeId="causeId" />
    </div>
</template>

<style lang="sass">
.causes
  display: flex
  flex-direction: column
  max-width: 600px
</style>

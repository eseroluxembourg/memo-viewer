<script setup lang="ts">
defineProps({
    cardNum: Number,
    cardTitle: String,
});
</script>

<template>
    <h1 class="card-title">
        <span>{{ cardNum }}</span>
        <span> - </span>
        <span>{{ cardTitle }}</span>
    </h1>
</template>

<style lang="sass">
.card-title
    font-weight: 700
    font-size: 2rem
    margin: 0 0.5rem 0.5rem
</style>

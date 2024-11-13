<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="top-banner">
        <h2>{{ title }}</h2>
    </div>
</template>

<style scoped lang="sass">
$primary: var(--primary)

.top-banner
  color: $primary
  text-shadow: #5a5a5a 1px 1px
  padding: 0.1rem 0
  text-align: center
  position: absolute
  width: 100%
  z-index: 1
</style>

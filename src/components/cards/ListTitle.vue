<script setup>
const props = defineProps({
    nameSingular: {
        type: String,
        required: true,
    },
    namePlural: {
        type: String,
        required: true,
    },
    withBadge: {
        type: Boolean,
        default: true,
    },
    badgeStatus: {
        type: String,
        required: true,
    },
    nbItems: {
        type: Number,
        required: true,
    },
});

const getLinkStyle = (classPrefix, linkStatus) => {
    return {
        [`${classPrefix}valid`]: linkStatus === 'valid',
        [`${classPrefix}optional`]: linkStatus === 'optional',
        [`${classPrefix}invalid`]: linkStatus === 'invalid',
    };
};
</script>

<template>
    <h2 class="list-title" v-if="props.nbItems > 0">
        <div class="badge" :class="getLinkStyle('badge-', props.badgeStatus)" v-if="props.withBadge">
            {{ props.nbItems }}
        </div>
        <span v-if="props.nbItems <= 1">{{ props.nameSingular }}</span>
        <span v-if="props.nbItems > 1">{{ props.namePlural }}</span>
    </h2>
</template>

<style lang="sass">
$primary: var(--primary)
$secondary: var(--secondary)
$ternary: rgb(255, 221, 103)
$shadow-color: #706f71

.list-title
  display: flex
  justify-content: center
  margin-top: 2rem

.badge
  color: #ffffff
  background-color: $shadow-color
  margin: 0 0.5rem
  width: 2rem
  height: 2rem
  border-radius: 1rem
  display: inline-block
  font-size: 1.6rem
  text-shadow: $secondary 1px 1px
  box-shadow: 1px 1px 0px $shadow-color

  &-valid
    color: #ffffff
    text-shadow: $secondary 1px 1px
    background-color: $primary
    box-shadow: 1px 1px 0px $shadow-color

  &-optional
    color: #ffffff
    text-shadow: $primary 1px 1px
    background-color: $ternary
    box-shadow: 1px 1px 0px $shadow-color

  &-invalid
    color: #ffffff
    text-shadow: $primary 1px 1px
    background-color: $secondary
    box-shadow: 1px 1px 0px $shadow-color
</style>

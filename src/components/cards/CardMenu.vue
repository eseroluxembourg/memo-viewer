<script setup lang="ts">
import LeftArrowIcon from '@/components/icons/LeftArrowIcon.vue';
import RightArrowIcon from '@/components/icons/RightArrowIcon.vue';
import ToggleView from '@/components/cards/list/ToggleView.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const props = defineProps({
    previousCardId: String,
    nextCardId: String,
});
const { locale } = useI18n();
const route = useRoute();
</script>
<template>
    <div class="menu-card">
        <router-link
            :to="{
                name: 'RouteCardDetails',
                params: { cardId: props.previousCardId, lang: locale, version: route.params.version },
            }"
            v-if="previousCardId !== undefined">
            <left-arrow-icon class="icon" :title="$t('card.previous')" :alt="$t('card.previous')" />
        </router-link>
        <div v-else></div>
        <toggle-view :selectedView="'card'" />
        <router-link
            :to="{ name: 'RouteCardDetails', params: { cardId: props.nextCardId, lang: locale, version: route.params.version } }"
            v-if="nextCardId !== undefined">
            <right-arrow-icon class="icon" :title="$t('card.next')" :alt="$t('card.next')" />
        </router-link>
        <div v-else></div>
    </div>
</template>

<style lang="sass">
.menu-card
    display: flex
    justify-content: space-between

.icon
  width: 24px
  margin: 2px
  transition: transform cubic-bezier(0.4, 0, 0.2, 1) 0.3s
  &:hover
    transform: scale(1.08)
</style>

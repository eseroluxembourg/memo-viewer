<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { CardGridItemType } from '@/typing';
import { PropType } from 'vue';

defineProps({
    card: {
        type: Object as PropType<CardGridItemType>,
        required: true,
    },
});

const route = useRoute();
const { locale } = useI18n();
</script>

<template>
    <router-link
        :to="{
            name: 'RouteCardDetails',
            params: { cardId: card.id, lang: locale, version: route.params.version },
        }">
        <picture v-lazyload>
            <source :data-srcset="card.image" sizes="(max-width:400px) 95vw, 450px" type="image/webp" />
            <img class="card-image" :data-src="card.image" :alt="card.title" :title="card.title" />
        </picture>
    </router-link>
</template>

<style scoped lang="sass">
.card-image
  width: 95vw
  max-width: 450px
  padding: 0
  cursor: pointer
  margin: 3px
  box-shadow: 1px 1px 4px #706f71
  padding-bottom: 56% // 16/9 ratio

.loaded .card-image
  padding-bottom: 0

.card-image:hover
  transform: scale(1.02)
  box-shadow: 3px 3px 7px #706f71
</style>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import CardView from './CardView.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const props = defineProps({
    cardId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const router = useRouter();
const cardStore = useCardsStore();
const swiper = ref(null);

const initialSlide = computed(() => {
    return cardStore.previousId(props.cardId) !== undefined ? 1 : 0;
});

watch(
    () => props.cardId,
    () => {
        cardStore.fetchEverythingForCard(props.cardId, route.params.lang, route.params.version);
        swiper.value.slideTo(initialSlide.value ? 1 : 0, 0);
    },
);

const onSwiper = (swiperInstance) => {
    swiper.value = swiperInstance;
};

const slideNextTransitionEnd = (swiperInstance) => {
    if (swiperInstance.activeIndex === initialSlide.value) return;
    router.push({
        name: 'RouteCardDetails',
        params: { cardId: cardStore.nextId(props.cardId), lang: route.params.lang, version: route.params.version },
    });
};

const slidePrevTransitionEnd = (swiperInstance) => {
    if (swiperInstance.activeIndex === initialSlide.value) return;
    router.push({
        name: 'RouteCardDetails',
        params: { cardId: cardStore.previousId(props.cardId), lang: route.params.lang, version: route.params.version },
    });
};
</script>

<template>
    <Swiper
        ref="mySwiper"
        class="swiper"
        :slides-per-view="1"
        :initialSlide="initialSlide"
        @swiper="onSwiper"
        @slideNextTransitionEnd="slideNextTransitionEnd"
        @slidePrevTransitionEnd="slidePrevTransitionEnd">
        <swiper-slide v-if="cardStore.previousId(props.cardId) !== undefined">
            <card-view :cardId="cardStore.previousId(props.cardId)" />
        </swiper-slide>
        <swiper-slide>
            <card-view :cardId="props.cardId" />
        </swiper-slide>
        <swiper-slide v-if="cardStore.nextId(props.cardId) !== undefined">
            <card-view :cardId="cardStore.nextId(props.cardId)" />
        </swiper-slide>
    </Swiper>
</template>

<style scoped>
.swiper {
    margin: 0 auto;
}
</style>

<script setup>
import { EyeIcon } from '@heroicons/vue/24/solid';
</script>

<template>
    <div class="btn join-item relative" @mouseover="showCard = true" @mouseleave="showCard = false">
        <EyeIcon class="w-4 h-4" />
        <div v-if="showCard" class="w-64 p-0 shadow z-10 bg-white absolute top-[40px]">
            <img :src="imageUrl" loading="lazy" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SortByButton',
    props: {
        imageUrl: String,
    },
    data: () => ({
        showCard: false,
    }),
    computed: {},
};
</script>

<script setup>
import GridIcon from '@/components/icons/GridIcon.vue';
import LinesIcon from '@/components/icons/LinesIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';
import QuizIcon from '@/components/icons/QuizIcon.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t, locale } = useI18n();

const selectedColor = 'var(--primary)';
const unselectedColor = '#706f71';

const props = defineProps({
    selectedView: {
        type: String,
        required: true,
    },
});

const svgStyle = (target) => {
    return {
        fill: props.selectedView === target ? selectedColor : unselectedColor,
    };
};
</script>

<template>
    <div class="toggle">
        <router-link :to="{ name: 'RouteCards', params: { view: 'grid', lang: locale, version: route.params.version } }">
            <GridIcon class="icon" :alt="t('all-cards.smallCards')" :title="t('all-cards.smallCards')" :style="svgStyle('grid')" />
        </router-link>
        <router-link :to="{ name: 'RouteCards', params: { view: 'list', lang: locale, version: route.params.version } }">
            <LinesIcon class="icon" :alt="t('all-cards.bigCards')" :title="t('all-cards.bigCards')" :style="svgStyle('list')" />
        </router-link>
        <router-link
            :to="{
                name: 'RouteCards',
                params: { view: 'network', lang: locale, version: route.params.version },
            }">
            <NetworkIcon class="icon" :alt="t('all-cards.networkCards')" :title="t('all-cards.networkCards')" :style="svgStyle('network')" />
        </router-link>
        <router-link
            :to="{
                name: 'RouteCards',
                params: { view: 'quiz', lang: locale, version: route.params.version },
            }">
            <QuizIcon class="icon" :alt="t('all-cards.quizCards')" :title="t('all-cards.quizCards')" :style="svgStyle('quiz')" />
        </router-link>
    </div>
</template>

<style scoped lang="sass">
.icon
  width: 25px
  height: 25px
  padding: 5px
  border-radius: 5px

.toggle .icon
  border: 2px solid #fff

.toggle .icon:hover
  border: 2px solid var(--primary)
</style>

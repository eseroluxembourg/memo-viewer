<template>
  <div class="toggle">
    <router-link
      :to="{ name: 'RouteGame', params: { view: 'grid', lang: $i18n.locale } }"
    >
      <grid-icon
        class="icon"
        :alt="$t('all-cards.smallCards')"
        :title="$t('all-cards.smallCards')"
        :style="svgStyle('grid')"
      />
    </router-link>
    <router-link
      :to="{ name: 'RouteGame', params: { view: 'list', lang: $i18n.locale } }"
    >
      <lines-icon
        class="icon"
        :alt="$t('all-cards.bigCards')"
        :title="$t('all-cards.bigCards')"
        :style="svgStyle('list')"
      />
    </router-link>
    <router-link
      :to="{
        name: 'RouteGame',
        params: { view: 'network', lang: $i18n.locale },
      }"
    >
      <network-icon
        class="icon"
        :alt="$t('all-cards.networkCards')"
        :title="$t('all-cards.networkCards')"
        :style="svgStyle('network')"
      />
    </router-link>
    <router-link
      :to="{
        name: 'RouteGame',
        params: { view: 'quiz', lang: $i18n.locale },
      }"
    >
      <quiz-icon
        class="icon"
        :alt="$t('all-cards.quizCards')"
        :title="$t('all-cards.quizCards')"
        :style="svgStyle('quiz')"
      />
    </router-link>
  </div>
</template>

<script>
import GridIcon from './GridIcon.vue';
import LinesIcon from './LinesIcon.vue';
import NetworkIcon from './NetworkIcon.vue';
import QuizIcon from './QuizIcon.vue';

const selectedColor = 'var(--primary)';
const unselectedColor = '#706f71';

export default {
  components: { GridIcon, LinesIcon, NetworkIcon, QuizIcon },
  props: {
    selectedView: String,
  },
  methods: {
    svgStyle(target) {
      return {
        fill: this.selectedView === target ? selectedColor : unselectedColor,
      };
    },
  },
};
</script>

<style scoped>
.icon {
  width: 25px;
  height: 25px;
  padding: 5px;
  border-radius: 5px;
}
.toggle .icon {
  border: 2px solid #fff;
}
.toggle .icon:hover {
  border: 2px solid var(--primary);
}
</style>

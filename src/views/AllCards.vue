<template>
  <h1 class="title">
    {{ $t('all-cards.title', { title: this.$t('local.config.title') }) }}
  </h1>
  <div class="menu">
    <toggle-view :selectedView="selectedView" />
    <sets-filter :sets="sets" @toggleSet="setSets" />
  </div>
  <CardsList v-if="view === 'list'" :sets="sets" />
  <CollageLayout
    v-else-if="view === 'network' || view === 'quiz'"
    :layoutName="collageLayoutName"
    :showBanner1="false"
    :quiz="view === 'quiz'"
  />
  <CardsMenu v-else :sets="sets" />
</template>

<script>
import ToggleView from '@/components/collections/ToggleView.vue';
import SetsFilter from '@/components/collections/SetsFilter.vue';
import CardsMenu from '@/components/collections/menu/CardsMenu.vue';
import CardsList from '@/components/collections/list/CardsList.vue';
import CollageLayout from '@/components/collages/CollageLayout.vue';

import meta from '@/utils/meta-vue3';

export default {
  name: 'AllCards',
  components: {
    ToggleView,
    CardsMenu,
    CardsList,
    CollageLayout,
    SetsFilter,
  },
  props: {
    view: {
      type: String,
      required: false,
      default: 'grid',
      validator: function (value) {
        // La valeur passée doit être l'une de ces chaines de caractères
        return ['grid', 'list', 'network', 'quiz'].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      sets: [1, 2, 3, 4, 5],
    };
  },
  created() {
    meta.setTitle(document, this.title);
    meta.setDescription(document, this.description);
  },
  computed: {
    title() {
      return this.$t('all-cards.title', {
        title: this.$t('local.config.title'),
      });
    },
    description() {
      return this.$t('local.description.all-cards');
    },
    selectedView() {
      if (['grid', 'list', 'network', 'quiz'].includes(this.view))
        return this.view;
      return 'grid';
    },
    maxSet() {
      return this.sets.reduce((max, val) => (max > val ? max : val));
    },
    collageLayoutName() {
      return 'set' + this.maxSet;
    },
  },
  methods: {
    setSets({ set }) {
      this.sets = [1, 2, 3, 4, 5].filter((s) => s <= set);
    },
  },
};
</script>

<style scoped>
.title {
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.4em;
  margin: 0.6rem auto;
}
.menu {
  max-width: 1400px;
  width: 95vw;

  display: flex;
  justify-content: space-around;
  margin: 0.2rem auto;
  flex-wrap: wrap;
}

@media screen and (min-width: 700px) {
  .menu {
    justify-content: space-between;
  }
}

/* .maxWidth450 {
  max-width: 450px;
}

.maxWidth1400 {
  max-width: 1400px;
} */
</style>

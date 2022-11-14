<template>
  <div class="card-details">
    <div class="card-details-panel" v-if="card">
      <CardTitle :card="card" />
      <CardMenu
        :card="card"
        :previousCardNum="previousCardNum"
        :nextCardNum="nextCardNum"
      />
      <CardFront :card="card" :key="$i18n.locale + 'front' + card.cardNum" />
      <CardBack
        :description="card.backDescription"
        :cardNumber="card.cardNum"
        :setNumber="card.cardSet"
        :cardTitle="$t('cards.' + card.cardNum + '.title')"
        :key="$i18n.locale + 'back' + card.cardNum"
      />
      <CardExplanation :card="card" />
      <CardMenu
        :card="card"
        :previousCardNum="previousCardNum"
        :nextCardNum="nextCardNum"
      />
      <!-- ====================== -->
      <!-- START - Intervenir ici -->
      <!-- ====================== -->
      <CardSpaceZone
        image
        :source="require(`@/assets/gif-test.gif`)"
        alt-text="gif"
      />
      <CardSpaceZone
        isVideo
        :arrayVideos="[
          { src: require(`@/assets/video-test.mp4`), type: 'video/mp4' },
          { src: require(`@/assets/video-test.mp4`), type: 'video/mp4' },
        ]"
      />
      <!-- Take embed link (share -> "<embed>") -->
      <CardSpaceZone
        youtubeLink
        source="https://www.youtube.com/embed/10anwlYG668"
      />
      <!-- ==================== -->
      <!-- END - Intervenir ici -->
      <!-- ==================== -->
      <CardLinks :card="card" />
      <CardMenu
        :card="card"
        :previousCardNum="previousCardNum"
        :nextCardNum="nextCardNum"
      />
      <router-link
        class="fdc-link withSpace"
        :to="{ name: 'RouteHome', params: { lang: $i18n.locale } }"
      >
        &larrhk; {{ $t('menu.back') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import CardTitle from './CardTitle.vue';
import CardMenu from './CardMenu.vue';
import CardBack from './CardBack.vue';
import CardFront from './CardFront.vue';
import CardExplanation from './CardExplanation.vue';
import CardLinks from './CardLinks.vue';
import CardsService from '@/services/CardsService';
import CardSpaceZone from '@/components/cards/CardSpaceZone';

export default {
  name: 'CardView',
  props: {
    card: Object,
  },
  components: {
    CardSpaceZone,
    CardTitle,
    CardMenu,
    CardFront,
    CardBack,
    CardExplanation,
    CardLinks,
  },
  computed: {
    previousCardNum: function () {
      return CardsService.getPreviousCardNum(this.card.cardNum);
    },
    nextCardNum: function () {
      return CardsService.getNextCardNum(this.card.cardNum);
    },
  },
};
</script>

<style scoped>
.card-details {
  display: flex;
  justify-content: center;
}
.card-details-panel {
  width: 95vw;
  max-width: 600px;
  padding: 0;
  margin: 3px;
}
.withSpace {
  margin: 2rem;
}
</style>

<template>
  <CardViewSwiper v-if="useSwipper" :cardNum="Number(cardNum)" />
  <CardView v-else :card="card" />
</template>

<script>
import CardViewSwiper from '@/components/cards/CardViewSwiper.vue';
import CardView from '@/components/cards/CardView.vue';
import CardsService from '@/services/CardsService';
import meta from '@/utils/meta-vue3';

export default {
  name: 'CardDetails',
  props: ['cardNum'],
  data() {
    return {
      useSwipper: window.innerWidth <= 768,
    };
  },
  components: {
    CardViewSwiper,
    CardView,
  },
  created() {
    meta.setTitle(document, this.title);
    meta.setDescription(document, this.description);
    meta.setOgTypeProduct(document, {
      image: `${process.env.BASE_URL}cards/${this.$i18n.locale}/default/${this.card.cardNum}-front.jpg`,
      url: window.location.pathname,
    });
  },
  computed: {
    title() {
      return this.$t('title.card', {
        title: this.$t('local.config.title'),
        cardTitle: this.$t('cards.' + this.card.cardNum + '.title'),
      });
    },
    description() {
      return this.$t('description.card', {
        cardTitle: this.$t('cards.' + this.card.cardNum + '.title'),
        cardDesc: this.$t('cards.' + this.card.cardNum + '.backDescription'),
      });
    },
    card: function () {
      return CardsService.getCardDetails(this.cardNum, this.$i18n.locale);
    },
    video: function () {
      return CardsService.getCardVideo(this.cardNum, this.$i18n.locale);
    },
  },
};
</script>

<template>
  <div class="anchorInList" :id="'carte-' + card.cardNum"></div>
  <router-link
    :to="{
      name: 'RouteCardDetails',
      params: { cardNum: card.cardNum, lang: $i18n.locale },
    }"
  >
    <picture>
      <source
        :srcset="imgPathWebp"
        sizes="(max-width:400px) 95vw, 450px"
        type="image/webp"
      />
      <img
        class="card-image"
        :src="imgPathDefault"
        :alt="$t('cards.' + card.cardNum + '.title')"
        :title="$t('cards.' + card.cardNum + '.title')"
      />
    </picture>
  </router-link>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  name: 'CardListItem',
  props: {
    card: Object,
  },
  computed: {
    imgPathDefault() {
      return `${process.env.BASE_URL}cards/${this.$i18n.locale}/default/${this.card.cardNum}-front.jpg`;
    },
    imgPathWebp() {
      return CardsService.getCardImgSrcSet(
        this.$i18n.locale,
        this.card.cardNum
      );
    },
  },
};
</script>

<style scoped>
.anchorInList {
  position: relative;
  top: -8rem;
}

.card-image {
  width: 95vw;
  max-width: 450px;
  padding: 0;
  cursor: pointer;
  margin: 3px;
  box-shadow: 1px 1px 4px #706f71;
}
.card-image:hover {
  transform: scale(1.02);
  box-shadow: 3px 3px 7px #706f71;
}
</style>

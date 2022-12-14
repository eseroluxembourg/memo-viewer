<template>
  <router-link
    :to="{
      name: 'RouteCardDetails',
      params: { cardNum: card.cardNum, lang: $i18n.locale },
    }"
  >
    <div class="card-item" :style="cardItemStyle">
      <div class="card-num">
        <img
          class="card-num-logo"
          src="@/assets/icons/card-number-icon.svg"
          :alt="card.cardNum"
        />
        <div class="card-num-digit">{{ card.cardNum }}</div>
      </div>
      <div class="card-image-frame">
        <picture>
          <source
            :srcset="imgPathWebp"
            sizes="(max-width:450px) 80px, 200px"
            type="image/webp" />
          <img
            class="card-image"
            :src="imgPathDefault"
            :alt="$t('cards.' + card.cardNum + '.title')"
            :title="$t('cards.' + card.cardNum + '.title')"
        /></picture>
      </div>
    </div>
  </router-link>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  name: 'CardMenuItem',
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
    cardItemStyle() {
      const widthPercentage = 20;
      const heightPercentage = (17 / 25) * widthPercentage;
      const widthMinPx = 100;
      const heightMin = (17 / 25) * widthMinPx;
      return {
        width: `${widthPercentage}vmin`,
        height: `${heightPercentage}vmin`,
        'min-width': `${widthMinPx}px`,
        'min-height': `${heightMin}px`,
      };
    },
  },
};
</script>

<style scoped>
.card-item {
  margin: max(3px, 0.4vw);
  position: relative;
}

.card-item:hover {
  transform: scale(1.1);
}

.card-item:hover .card-num-logo {
  opacity: 1;
}

.card-num {
  width: 100%;
  height: 85%;
  margin: 0 auto;
  margin-top: 15%;
  text-align: center;
  position: absolute;
  z-index: 100;
}

.card-num-logo {
  position: absolute;
  width: 60%;
  height: 90%;
  left: 20%;
  opacity: 0.5;
}

.card-num-digit {
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: max(1.5rem, 5vmin);
  font-family: 'Avenir Next', 'HelveticaNeue', 'Helvetica Neue', 'Helvetica',
    Arial, sans-serif;
  text-shadow: 1px 1px #444;
}
.card-image-frame {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 4px #706f71;
}
.card-image-frame:hover {
  box-shadow: 3px 3px 7px #706f71;
}
.card-image {
  width: 100%;
  height: 100%;
  padding: 0;
  cursor: pointer;
}
</style>

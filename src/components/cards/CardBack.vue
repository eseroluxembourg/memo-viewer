<template>
  <div class="back">
    <picture v-if="!svgString">
      <source
        :srcset="imgPathWebp"
        sizes="(max-width:800px) 30vw, 240px"
        type="image/webp"
      />
      <img :src="imgPathDefault" />
    </picture>
    <div id="back-img" :innerHTML="svgString" />
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  data: () => ({ svgString: undefined }),
  name: 'CardBack',
  props: {
    cardNumber: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const svgUrl = CardsService.getBackCardImgSvg(
        this.$i18n.locale,
        this.cardNumber
      );
      this.svgString = undefined;
      fetch(svgUrl)
        .then((response) => response.text())
        .then((svgString) => {
          this.svgString = svgString;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    imgPathWebp() {
      return CardsService.getBackCardImgSrcSet(
        this.$i18n.locale,
        this.cardNumber
      );
    },
    imgPathDefault() {
      return `${process.env.BASE_URL}cards/${this.$i18n.locale}/default/${this.cardNumber}-back.png`;
    },
  },
};
</script>

<style>
.back svg {
  width: 100%;
  height: 100%;
}

.back {
  margin: 0.8rem 0;
  box-shadow: 1px 1px 4px #706f71;
  width: 95vw;
  max-width: 594px;
  height: 63.33vw;
  max-height: 403px;
  display: flex;
  flex-direction: column;
  align-content: stretch;
}

.back img {
  width: 100%;
}
</style>

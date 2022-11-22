<template>
  <div class="pictoLink">
    <a
      v-for="picto in spacePictoPaths"
      :href="picto.link"
      :key="picto.icon"
      class="picto"
    >
      <img :src="picto.icon" :alt="picto.altText" />
    </a>
  </div>
</template>

<script>
import CardsService from '@/services/CardsService';

export default {
  name: 'PictoLink',
  props: {
    source: String,
    card: Object,
  },
  computed: {
    spacePictoPaths() {
      console.log(this.source);
      return CardsService.getSpacePicto(
        this.$i18n.locale,
        this.card.cardNum,
        this.source
      );
    },
  },
};
</script>

<style scoped lang="scss">
.pictoLink {
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.picto {
  width: 40px;
  margin: 0 0.5rem;
  border: 1px solid red;

  img {
    height: 32px;

    &:hover {
      height: 40px;
    }
  }
}
</style>

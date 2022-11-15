<template>
  <div class="pictoLink">
    <a
      v-for="picto in arrayPicto"
      :href="picto.link"
      :key="picto.text"
      class="picto"
    >
      <img :src="picto.source" :alt="picto.altText" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'PictoLink',
  props: {
    arrayPicto: [Object],
  },
};
</script>

<style scoped lang="scss">
.pictoLink {
  height: 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 0.5rem;
}

.picto {
  width: 40px;

  img {
    height: 32px;

    &:hover {
      height: 40px;
    }
  }
}
</style>

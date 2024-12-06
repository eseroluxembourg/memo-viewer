<script setup>
import { useCardsStore } from '@/stores/cards.js';
import { useI18n } from 'vue-i18n';
import EditButton from '@/components/site/EditButton.vue';

const cardStore = useCardsStore();
const { locale } = useI18n();
defineProps({
    cardId: String,
});
</script>

<template>
    <div class="explanation">
        <!--<EditButton
            :header="true"
            :targetLang="locale"
            :chosenLang="cardStore.htmlLanguage(cardId, locale)"
            :fileSourceUrl="cardStore.cardFileSourceUrl(cardId, locale)" />-->
        <EditButton
            :header="false"
            :targetLang="locale"
            :chosenLang="cardStore.htmlLanguage(cardId, locale)"
            :fileSourceUrl="cardStore.cardFileSourceUrl(cardId, locale)" />

        <div v-html="cardStore.html(cardId, locale)"></div>
        <EditButton
            :header="false"
            :targetLang="locale"
            :chosenLang="cardStore.htmlLanguage(cardId, locale)"
            :fileSourceUrl="cardStore.cardFileSourceUrl(cardId, locale)" />
    </div>
</template>

<style scoped lang="sass">
.explanation
  img
    position: relative
    width: 1.5rem

.explanation
  img
    max-width: 100%
    max-height: 500px
    margin-left: auto
    margin-right: auto

.explanation
  margin: 1rem 1rem
  max-width: 600px
  font-size: 1rem
  text-align: left
  line-height: 1.6rem

.footnotes-sep
  color: #fff
  border-top: 1px solid #cecece
  max-width: 200px
  margin-left: 0
  border-bottom: unset

.footnote-ref a,
.footnote-backref
  text-decoration: none

.footnote-ref a,
.footnote-item
  padding-top: 100px
  margin-top: -100px
  &:before
    //  content: " ";
    padding-top: 100px
    margin-top: -100px
    visibility: hidden

p
  margin: 0
</style>

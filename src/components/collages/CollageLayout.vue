<template>
  <CollageBanner1
    v-if="showBanner1"
    :layout="layout"
    :cards="cards"
    :selectedCard="selectedCard"
  />
  <CollageNetwork
    id="network"
    :nodes="nodes"
    :edges="edges"
    @node-double-selection="onNodeDoubleSelection"
    @node-selection="onNodeSelection"
  />
  <CollageBanner2
    :layout="layout"
    :cards="cards"
    :selectedCard="selectedCard"
  />
</template>

<script>
import CollageBanner1 from './CollageBanner1.vue';
import CollageBanner2 from './CollageBanner2.vue';
import CollageNetwork from './CollageNetwork.vue';
import CardsService from '@/services/CardsService';
import LayoutService from '@/services/LayoutService';

const cardSize = 30;
const cardMarginRatio = 1.8;

const cardMargin = cardMarginRatio * cardSize;
const cardMarginX = cardMargin;
const cardMarginY = cardMargin;
const cardSpaceX = 2.9 * cardSize + cardMarginX;
const cardSpaceY = 2.0 * cardSize + cardMarginY;

export default {
  components: {
    CollageBanner1,
    CollageBanner2,
    CollageNetwork,
  },
  props: {
    layoutName: {
      type: String,
      validator: function (value) {
        return LayoutService.isValidLayout(value);
      },
    },
    showBanner1: {
      type: Boolean,
      default: true,
    },
    showBanner2: {
      type: Boolean,
      default: true,
    },
    quiz: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    selectedCard: undefined,
    visibleCards: [],
  }),
  computed: {
    layout() {
      return LayoutService.getLayoutByName(this.layoutName);
    },
    cards() {
      const cards = CardsService.getCards().filter(
        (card) => !this.layout.cardFilter || this.layout.cardFilter(card)
      );
      return cards;
    },
    nodes() {
      return this.cards.map(this.nodeFromCard);
    },
    links() {
      const officialLinks = CardsService.getLinks().filter(
        (link) => !this.layout.linkFilter || this.layout.linkFilter(link)
      );
      console.log(officialLinks);
      console.log(officialLinks);
      const additionalLinks = (this.layout.links || []).map((link) => ({
        explanation: '',
        ...link,
        tmp: true,
      }));
      const links = [...officialLinks, ...additionalLinks];
      return links;
    },
    edges() {
      return this.links.map(this.edgeFromLink);
    },
  },
  methods: {
    nodeFromCard(card) {
      const cardLayout =
        this.layout.cards.find((c) => c.cardNum === card.cardNum) || {};

      const { nodeOptions } = cardLayout;
      if (!nodeOptions) {
        console.warn(
          `Card ${card.cardNum} '${card.cardNum}' not found in the layout ${this.layoutName}`
        );
        return {
          id: card.cardNum,
        };
      }

      const img =
        this.quiz && !this.visibleCards.includes(card.cardNum)
          ? `${process.env.BASE_URL}cards/unknown-card.png`
          : `${process.env.BASE_URL}cards/${this.$i18n.locale}/450/${card.cardNum}-front.webp`;

      return {
        id: card.cardNum,
        shape: 'image',
        image: img,
        ...nodeOptions,
        x: nodeOptions.xPos * cardSpaceX,
        y: nodeOptions.yPos * cardSpaceY,
        size: (nodeOptions.zoom || 1) * cardSize,
      };
    },
    edgeFromLink(link) {
      const edge = {
        from: link.fromNum,
        to: link.toNum,
        ...this.edgeOptions(link),
      };
      if (!this.layout.edgeMap) {
        return edge;
      }
      return this.layout.edgeMap(link, edge);
    },
    edgeOptions(link) {
      return {
        width: 2,
        color: {
          color:
            link.status === 'invalid'
              ? '#e90000'
              : link.tmp
              ? '#aaa'
              : '#04c2c0',
        },
        dashes: link.tmp,
        widthConstraint: {
          maximum: 7,
        },
        arrows: {
          // from: {
          //   // To show the arrow root
          //   enabled: true,
          //   type: 'bar',
          // },
          to: {
            // To show the arrow head
            enabled: true,
          },
        },
        smooth: {
          enabled: true,
          // 'dynamic'
          // 'continuous'
          // 'discrete'
          // 'diagonalCross'
          // 'straightCross'
          // 'horizontal'
          // 'vertical'
          // 'curvedCW'
          // 'curvedCCW'
          // 'cubicBezier'
          // best: discrete, vertical/horizontal, cubicBezier+forceDirection'vertical'/horizontal
          type: 'cubicBezier',
          // For cubicBezier curves: ['horizontal', 'vertical', 'none']
          forceDirection: 'horizontal',
          roundness: 0.8,
        },
      };
    },
    onNodeSelection(nodeNum) {
      this.selectedCard = this.cards.find((card) => card.cardNum === nodeNum);
      if (!this.visibleCards.includes(nodeNum)) this.visibleCards.push(nodeNum);
      else this.visibleCards.splice(this.visibleCards.indexOf(nodeNum), 1);
    },
    onNodeDoubleSelection(nodeNum) {
      this.$router.push({
        name: 'RouteCardDetails',
        params: { cardNum: nodeNum, lang: this.$i18n.locale },
      });
    },
  },
};
</script>

<style></style>

export default {
  getSets() {
    return [
      ...new Set(Object.values(this.getCards()).map((card) => card.cardSet)),
    ].sort();
  },
  getCardImgSrcSet(locale, cardNum) {
    const imgSizes = [125, 250, 450, 600];
    const srcSet = imgSizes
      .map(
        (size) =>
          `${process.env.BASE_URL}cards/${locale}/${size}/${cardNum}-front.webp ${size}w,`
      )
      .join();
    return srcSet;
  },
  getBackCardImgSrcSet(locale, cardNum) {
    const imgSizes = [125, 250, 450, 600];
    const srcSet = imgSizes
      .map(
        (size) =>
          `${process.env.BASE_URL}cards/${locale}/${size}/${cardNum}-back.webp ${size}w,`
      )
      .join();
    return srcSet;
  },
  getFrontCardImgSvg(locale, cardNum) {
    return `${process.env.BASE_URL}cards/${locale}/svg/${cardNum}-front.svg`;
  },
  getBackCardImgSvg(locale, cardNum) {
    return `${process.env.BASE_URL}cards/${locale}/svg/${cardNum}-back.svg`;
  },
  getCards() {
    return require(`@/data/cards.json`);
  },
  getNextCardNum(cardNum) {
    return Math.min(
      ...this.getCards()
        .map((card) => card.cardNum)
        .filter((x) => x > cardNum)
    );
  },
  getPreviousCardNum(cardNum) {
    return Math.max(
      ...this.getCards()
        .map((card) => card.cardNum)
        .filter((x) => x < cardNum)
    );
  },
  getLinks() {
    return require(`@/data/links.json`);
  },
  getCardData(cardNum) {
    const card = this.getCards().find(
      (c) => c.cardNum.toString() === cardNum.toString()
    );
    if (!card) {
      throw new Error(`Card with num ${cardNum} not found`);
    }
    return card;
  },
  getCardLinks(cardNum) {
    const causesCards = this.getLinks()
      .filter((l) => l.toNum.toString() === cardNum.toString())
      .map((link) => ({
        from: this.getCardData(link.fromNum),
        to: this.getCardData(link.toNum),
        link,
      }));
    const consequencesCards = this.getLinks()
      .filter((l) => l.fromNum.toString() === cardNum.toString())
      .map((link) => ({
        from: this.getCardData(link.fromNum),
        to: this.getCardData(link.toNum),
        link,
      }));
    return {
      causes: causesCards,
      consequences: consequencesCards,
    };
  },
  getCardDetails(cardNum) {
    const card = this.getCardData(cardNum);
    const links = this.getCardLinks(cardNum);
    return {
      ...card,
      ...links,
    };
  },
  getSpaceImgPath(locale, cardNum, source) {
    return `${process.env.BASE_URL}${source}`;
  },
  getSpaceVideoPaths(locale, cardNum, source) {
    const sources = source.split(';');
    return sources.map((source) => {
      const item = source.split(',');
      return {
        type: item[1],
        src: `${process.env.BASE_URL}${item[0]}`,
      };
    });
  },
  getSpaceYoutubePath(source) {
    return source;
  },
  getSpacePicto(locale, cardNum, source) {
    const sources = source.split(';');
    return sources.map((source) => {
      const item = source.split(',');

      return {
        icon: `${process.env.BASE_URL}assets/space/${item[0]}.png`,
        link: item[1],
        altText: item[2],
      };
    });
  },
};

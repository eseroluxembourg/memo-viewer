const regex = /^([a-z-A-Z]*)(\d*)$/;

/**
 *
 * Specs:
 * - If cardNumberA and cardNumberB are number:
 *      compare numbers: 19 before 20
 * - If cardNumberA and cardNumber like A20, B30:
 *      compare letters THEN numbers
 *  (digitalcollage)
 * - If cardNumberA and cardNumber like 4.30:
 *      compare first number THEN numbers
 * (oceans fresk)
 * @param {String} cardNumberA
 * @param {String} cardNumberB
 */
export function isStrictlyBefore(cardNumberA, cardNumberB) {
    if (typeof cardNumberA === 'number') cardNumberA = cardNumberA.toString();
    if (typeof cardNumberB === 'number') cardNumberB = cardNumberB.toString();

    if (cardNumberA.includes('.') && cardNumberB.includes('.')) {
        const beginA = cardNumberA.indexOf('.');
        const beginB = cardNumberB.indexOf('.');

        const groupA = cardNumberA.slice(0, beginA);
        const groupB = cardNumberB.slice(0, beginB);

        if (groupA === groupB) return isStrictlyBefore(cardNumberA.slice(beginA + 1), cardNumberB.slice(beginB + 1));

        return groupA < groupB;
    }

    if (!isNaN(cardNumberA) && !isNaN(cardNumberB)) return parseInt(cardNumberA) < parseInt(cardNumberB);

    const groupsA = regex.exec(cardNumberA);
    const groupsB = regex.exec(cardNumberB);

    // Default option
    if (groupsA === null || groupsB === null) {
        return cardNumberA < cardNumberB;
    }

    if (groupsA[1] !== '' && groupsA[1] == groupsB[1]) return parseInt(groupsA[2]) < parseInt(groupsB[2]);
    return groupsA[1] < groupsB[1];
}

export function isBefore(cardNumberA, cardNumberB) {
    return cardNumberA === cardNumberB || isStrictlyBefore(cardNumberA, cardNumberB);
}

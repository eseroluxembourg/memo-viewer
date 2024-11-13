import { v4 as uuidv4 } from 'uuid';

/**
 *
 * Return a random (uniform) element from
 * any Array
 *
 * @param {T} array
 * @return T
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateUuid8() {
    return uuidv4().slice(0, 8);
}

/**
 * Return the elemnt right before the one we want
 * TODO: use find ?
 * @param {*} elements
 * @param {*} element
 * @returns
 */
export function previousElement(elements, element) {
    const k = elements.findIndex((x) => x === element);
    if (k < 0) throw new Error();

    let previousK = k - 1;
    if (previousK < 0) previousK = elements.length - 1;
    return elements[previousK];
}

export function nextElement(elements, element) {
    const k = elements.findIndex((x) => x === element);
    if (k < 0) throw new Error();

    let nextK = k + 1;
    if (nextK === elements.length) nextK = 0;
    return elements[nextK];
}

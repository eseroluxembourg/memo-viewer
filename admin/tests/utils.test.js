// Test file for src/utils/utils.js

import { expect, test } from 'vitest';

import { previousElement, nextElement } from '../src/utils/utils.js';

test('prevousELement valid, only text update', () => {
    const elements = [1, 2, 3, 4, 5, 6];

    expect(previousElement(elements, 1)).toEqual(6);
    expect(previousElement(elements, 2)).toEqual(1);
    expect(previousElement(elements, 3)).toEqual(2);
    expect(previousElement(elements, 4)).toEqual(3);
    expect(previousElement(elements, 5)).toEqual(4);
    expect(previousElement(elements, 6)).toEqual(5);

    expect(nextElement(elements, 1)).toEqual(2);
    expect(nextElement(elements, 2)).toEqual(3);
    expect(nextElement(elements, 3)).toEqual(4);
    expect(nextElement(elements, 4)).toEqual(5);
    expect(nextElement(elements, 5)).toEqual(6);
    expect(nextElement(elements, 6)).toEqual(1);
});

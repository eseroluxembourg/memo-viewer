import { expect, test } from 'vitest';

import { isStrictlyBefore } from './src/utils/cardsordering';

/**
 * Cards Number are very simple: only numbers
 */
test('ClimateFresk ordering', () => {
    expect(isStrictlyBefore(8, '11')).toBeTruthy();
    expect(isStrictlyBefore('10', '11')).toBeTruthy();
    expect(isStrictlyBefore('10', '10')).toBeFalsy();
    expect(isStrictlyBefore('01', '11')).toBeTruthy();
    expect(isStrictlyBefore('1', '05')).toBeTruthy();
    expect(isStrictlyBefore('05', '9')).toBeTruthy();
    expect(isStrictlyBefore('12', '10')).toBeFalsy();
});

/**
 * Main cards number are number,
 * some are letters (A, B, C, D and E)
 * And some are S1, ..., S21
 */
test('DigitalCollage ordering', () => {
    expect(isStrictlyBefore('1', '39')).toBeTruthy();
    expect(isStrictlyBefore('1', 'A')).toBeTruthy();
    expect(isStrictlyBefore('21', 'B')).toBeTruthy();
    expect(isStrictlyBefore('11', 'C')).toBeTruthy();
    expect(isStrictlyBefore('203', 'D')).toBeTruthy();
    expect(isStrictlyBefore('42', 'E')).toBeTruthy();
    expect(isStrictlyBefore('E', 'S2')).toBeTruthy();
    expect(isStrictlyBefore('S19', 'S22')).toBeTruthy();
    expect(isStrictlyBefore('42', 'S1')).toBeTruthy();
    expect(isStrictlyBefore('A', 'E')).toBeTruthy();
    expect(isStrictlyBefore('B', 'E')).toBeTruthy();
    expect(isStrictlyBefore('C', 'E')).toBeTruthy();

    expect(isStrictlyBefore('30', '4')).toBeFalsy();
    expect(isStrictlyBefore('A', 'A')).toBeFalsy();
    expect(isStrictlyBefore('S17', 'S2')).toBeFalsy();
});

/**
 * Numbers are <lot>.<cardnumber>
 * Eg. 3.03
 */
test('Ocean Fresk ordering', () => {
    expect(isStrictlyBefore('1.01', '1.02')).toBeTruthy();
    expect(isStrictlyBefore('1.20', '2.01')).toBeTruthy();
    expect(isStrictlyBefore('2.25D', '2.26D')).toBeTruthy();
    expect(isStrictlyBefore('4.01', '4.03')).toBeTruthy();
    expect(isStrictlyBefore('4.01', '4.20')).toBeTruthy();
});

// TODO check structure

import matter from 'gray-matter';

import { expect, test, onTestFailed } from 'vitest';
import {
    validateFresk,
    validateCard,
    validateCardLangs,
    validateLink,
    validateSettings,
    validateVariants,
    validateLinksStyle,
} from '../data-validation';

import fs from 'fs';

test('Validate settings', () => {
    const settingsFile = JSON.parse(fs.readFileSync(`${__dirname}/../settings.json`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateSettings.errors);
    });
    expect(validateSettings(settingsFile)).toBeTruthy();
});

test('Validate linksStyle', () => {
    const linksStyleFile = JSON.parse(fs.readFileSync(`${__dirname}/../src/assets/_links/linksStyle.json`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateLinksStyle.errors);
    });
    expect(validateLinksStyle(linksStyleFile)).toBeTruthy();
});

test('Validate variants', () => {
    const variantsFile = JSON.parse(fs.readFileSync(`${__dirname}/../variants.json`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateVariants.errors);
    });
    expect(validateVariants(variantsFile)).toBeTruthy();
});

const cards = fs.readdirSync(`${__dirname}/../src/assets/_cards`);
test.each(cards)('Validate card %s', (cardId) => {
    if (cardId === '.gitkeep') return;

    let lang;
    let cardLang;
    onTestFailed(() => {
        console.log(lang);
        console.log(card);
        console.log(cardLang);
        console.log(validateCard.errors);
        console.log(validateCardLangs.errors);
    });

    const card = matter(fs.readFileSync(`${__dirname}/../src/assets/_cards/${cardId}/index.md`, 'utf-8'));
    expect(validateCard(card)).toBeTruthy();

    const langs = fs.readdirSync(`${__dirname}/../src/assets/_cards/${cardId}`);
    for (lang of langs) {
        if (lang === 'index.md') continue;
        cardLang = matter(fs.readFileSync(`${__dirname}/../src/assets/_cards/${cardId}/${lang}/index.md`, 'utf-8'));
        expect(validateCardLangs(cardLang)).toBeTruthy();
    }
});

const links = fs.readdirSync(`${__dirname}/../src/assets/_links`);
test.each(links)('Validate link %s', (linkId) => {
    if (linkId === '.gitkeep') return;
    if (linkId.endsWith('.json')) return;

    let lang;
    let linkLang;
    onTestFailed(() => {
        console.log(lang);
        console.log(linkLang);
        console.log(validateLink.errors);
    });

    const langs = fs.readdirSync(`${__dirname}/../src/assets/_links/${linkId}`);
    for (lang of langs) {
        if (lang === 'index.md') continue;
        linkLang = matter(fs.readFileSync(`${__dirname}/../src/assets/_links/${linkId}/${lang}/index.md`, 'utf-8'));
        expect(validateLink(linkLang)).toBeTruthy();
    }
});

const fresks = fs.readdirSync(`${__dirname}/../src/assets/_fresks`).filter((file) => file.endsWith('.json'));
test.each(fresks)('Validate fresk %s', (file) => {
    const fresk = JSON.parse(fs.readFileSync(`${__dirname}/../src/assets/_fresks/${file}`, 'utf-8'));

    onTestFailed(() => {
        console.log(validateFresk.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateFresk(fresk)).toBeTruthy();
});

test('Check that we have exactly one fresk for each cardsset and variant', () => {
    const allSets = new Set();
    const variantsFile = JSON.parse(fs.readFileSync(`${__dirname}/../variants.json`, 'utf-8'));

    for (const v in variantsFile) {
        for (const k in cards) {
            if (cards[k] === '.gitkeep') continue;
            const card = matter(fs.readFileSync(`${__dirname}/../src/assets/_cards/${cards[k]}/index.md`, 'utf-8'));
            if (!card.data.variants.includes(v)) continue;
            allSets.add(card.data['lot']);
        }

        for (const k in fresks) {
            if (fresks[k] === '.gitkeep') continue;
            const fresk = JSON.parse(fs.readFileSync(`${__dirname}/../src/assets/_fresks/${fresks[k]}`, 'utf-8'));
            if (!fresk.variants.includes(v)) continue;
            expect(allSets.delete(fresk.lot)).toBeTruthy();
        }

        expect(allSets.size).toBe(0);
    }
});

test('Check that we have at least one about page', () => {
    const aboutPages = fs.readdirSync(`${__dirname}/../src/assets/_pages/about`).filter((file) => file.endsWith('.md'));
    console.log(aboutPages);
    expect(aboutPages.length).toBeGreaterThanOrEqual(1);
});

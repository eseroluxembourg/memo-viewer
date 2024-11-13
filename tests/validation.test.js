// todo
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

const fresks = fs.readdirSync(`${__dirname}/assets/fresks`).filter((file) => file.endsWith('.json'));
test.each(fresks)('Validate fresk %s', (file) => {
    const fresk = JSON.parse(fs.readFileSync(`${__dirname}/assets/fresks/${file}`, 'utf-8'));

    onTestFailed(() => {
        console.log(validateFresk.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateFresk(fresk)).toBe(file.indexOf('.fail') == -1);
});

const cards = fs.readdirSync(`${__dirname}/assets/cards`).filter((file) => file.endsWith('.md'));
test.each(cards)('Validate card (index.md) %s', (file) => {
    const card = matter(fs.readFileSync(`${__dirname}/assets/cards/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateCard.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateCard(card)).toBe(file.indexOf('.fail') == -1);
});

const cardLangs = fs.readdirSync(`${__dirname}/assets/cardlangs`).filter((file) => file.endsWith('.md'));
test.each(cardLangs)('Validate card lang %s', (file) => {
    const card = matter(fs.readFileSync(`${__dirname}/assets/cardlangs/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateCardLangs.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateCardLangs(card)).toBe(file.indexOf('.fail') == -1);
});

const links = fs.readdirSync(`${__dirname}/assets/links`).filter((file) => file.endsWith('.md'));
test.each(links)('Validate link %s', (file) => {
    const link = matter(fs.readFileSync(`${__dirname}/assets/links/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateLink.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateLink(link)).toBe(file.indexOf('.fail') == -1);
});

const variants = fs.readdirSync(`${__dirname}/assets/variants`).filter((file) => file.endsWith('.json'));
test.each(variants)('Validate variant %s', (file) => {
    const variant = JSON.parse(fs.readFileSync(`${__dirname}/assets/variants/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateVariants.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateVariants(variant)).toBe(file.indexOf('.fail') == -1);
});

const settings = fs.readdirSync(`${__dirname}/assets/settings`).filter((file) => file.endsWith('.json'));
test.each(settings)('Validate variant %s', (file) => {
    const settingsFile = JSON.parse(fs.readFileSync(`${__dirname}/assets/settings/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateSettings.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateSettings(settingsFile)).toBe(file.indexOf('.fail') == -1);
});

const linksStyle = fs.readdirSync(`${__dirname}/assets/linksStyle`).filter((file) => file.endsWith('.json'));
test.each(linksStyle)('Validate variant %s', (file) => {
    const linksStyleFile = JSON.parse(fs.readFileSync(`${__dirname}/assets/linksStyle/${file}`, 'utf-8'));
    onTestFailed(() => {
        console.log(validateLinksStyle.errors);
    });

    // If filename contains .fail, validation should fail )
    expect(validateLinksStyle(linksStyleFile)).toBe(file.indexOf('.fail') == -1);
});

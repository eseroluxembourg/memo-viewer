import * as fs from 'fs';
import matter from 'gray-matter';

function flattenNestedObject(nestedObject, prefix, result) {
    for (const key in nestedObject) {
        const newPrefix = prefix === '' ? key : prefix + '.' + key;
        if (typeof nestedObject[key] === 'object') {
            flattenNestedObject(nestedObject[key], newPrefix, result);
        } else {
            result[newPrefix] = nestedObject[key];
        }
    }
}

/**
 * Pull function receives an object of localized translations
 * and update local files
 *
 * { [i18code]: { [key]: value } }.
 *
 */
export const pull = (translationsByCode) => {
    const orderedKeys = Object.keys(translationsByCode);
    orderedKeys.sort();
    for (const code of orderedKeys) {
        console.info(`${code}: `);
        const translations = translationsByCode[code];

        // Card
        if (translations.card !== undefined) {
            const flattenTranslations = {};
            flattenNestedObject(translations.card, '', flattenTranslations);

            const cardsData = [];
            for (const path in flattenTranslations) {
                const k = path.lastIndexOf('.');
                const cardId = path.slice(0, k);
                const field = path.slice(k + 1);
                if (cardsData[cardId] === undefined) cardsData[cardId] = {};
                cardsData[cardId][field] = flattenTranslations[path];
            }

            for (let cardId in cardsData) {
                let card = cardsData[cardId];

                let mdCard = { content: '', data: {} };
                if (fs.existsSync(`_cards/${cardId}/${code}/index.md`)) mdCard = matter(fs.readFileSync(`_cards/${cardId}/${code}/index.md`));
                mdCard.content = card.explanations || '';

                if (card.backDescription !== undefined) mdCard.data.backDescription = card.backDescription;

                if (card.title !== undefined) mdCard.data.title = card.title;

                fs.mkdirSync(`_cards/${cardId}/${code}`, { recursive: true });
                fs.writeFileSync(`_cards/${cardId}/${code}/index.md`, matter.stringify(mdCard.content, mdCard.data));
            }
            console.info(`> ${cardsData.length} cards updated`);
        }
        // Link
        if (translations.link !== undefined) {
            const flattenTranslations = {};
            flattenNestedObject(translations.link, '', flattenTranslations);

            const linksData = [];
            for (const path in flattenTranslations) {
                const k = path.lastIndexOf('.');
                const linkId = path.slice(0, k);
                const field = path.slice(k + 1);
                if (linksData[linkId] === undefined) linksData[linkId] = {};
                linksData[linkId][field] = flattenTranslations[path];
            }

            for (let linkId in linksData) {
                const link = linksData[linkId];

                const existingLangs = fs.readdirSync(`_links/${linkId}`);
                const refLang = existingLangs[0];

                // Reuse fromcardid, tocardid and status
                const mdLink = matter(fs.readFileSync(`_links/${linkId}/${refLang}/index.md`));

                mdLink.content = link.explanations || '';
                fs.mkdirSync(`_links/${linkId}/${code}`, { recursive: true });
                fs.writeFileSync(`_links/${linkId}/${code}/index.md`, matter.stringify(mdLink.content, mdLink.data));
            }
            console.info(`> ${Object.keys(linksData).length} links updated`);
        }

        // Fresk
        if (translations.fresk !== undefined) {
            const flattenTranslations = {};
            flattenNestedObject(translations.fresk, '', flattenTranslations);

            const fresksData = [];
            for (const path in flattenTranslations) {
                const k = path.lastIndexOf('.');
                const freskId = path.slice(0, k);
                const field = path.slice(k + 1);
                if (fresksData[freskId] === undefined) fresksData[freskId] = {};
                fresksData[freskId][field] = flattenTranslations[path];
            }

            for (const freskId in fresksData) {
                const jsonFresk = JSON.parse(fs.readFileSync(`_fresks/${freskId}.json`));
                if (fresksData[freskId].title !== undefined) {
                    jsonFresk.title[code] = fresksData[freskId].title;
                    fs.writeFileSync(`_fresks/${freskId}.json`, JSON.stringify(jsonFresk, null, 4));
                }
            }
            console.info(`> ${Object.keys(fresksData).length} fresks updated`);
        }

        // // Settings
        if (translations.settings !== undefined) {
            const settings = JSON.parse(fs.readFileSync('settings.json'));
            // ['title', 'description', 'fresk-label']
            if (translations.settings.title !== undefined && translations.settings.title !== null) settings.title[code] = translations.settings.title;
            if (translations.settings.description !== undefined && translations.settings.description !== null)
                settings.description[code] = translations.settings.description;
            if (translations.settings['fresk-label'] !== undefined && translations.settings['fresk-label'] !== null)
                settings['fresk-label'][code] = translations.settings['fresk-label'];

            if (translations.settings.i18n !== undefined) {
                const flattenTranslations = {};
                flattenNestedObject(translations.settings.i18n, '', flattenTranslations);
                for (const key in flattenTranslations) {
                    if (settings.i18n[code] === undefined) settings.i18n[code] = {};
                    settings.i18n[code][key] = flattenTranslations[key];
                }
            }
            fs.writeFileSync('settings.json', JSON.stringify(settings, null, 4));
        }
    }
};

export const listI18nCodes = () => {
    const allLangs = new Set();

    const cards = fs.readdirSync('_cards');
    for (let card of cards) {
        const langs = fs.readdirSync(`_cards/${card}`);
        for (const lang of langs) {
            if (lang === 'index.md') continue;
            allLangs.add(lang);
        }
    }
    return Array.from(allLangs);
};

/**
 * Push function reads the repository and creates localized translations
 * @return { [i18ncode]: { [key]: value }}
 */
export const push = () => {
    const translationsByCode = {};
    const tags = {};

    const cards = fs.readdirSync('_cards');
    for (let card of cards) {
        const langs = fs.readdirSync(`_cards/${card}`);
        for (const code of langs) {
            if (code === 'index.md') continue;
            if (translationsByCode[code] === undefined) translationsByCode[code] = {};

            const mdCard = matter(fs.readFileSync(`_cards/${card}/${code}/index.md`));
            const data = mdCard['data'];

            translationsByCode[code][`card.${card}.title`] = data.title;
            translationsByCode[code][`card.${card}.backDescription`] = data.backDescription;
            if (mdCard['content'].trim() === '') translationsByCode[code][`card.${card}.explanations`] = null;
            else translationsByCode[code][`card.${card}.explanations`] = mdCard['content'];

            if (tags[`card.${card}.title`] === undefined) {
                tags[`card.${card}.title`] = ['card', `card${card}`, 'cardTitle'];
            }
            if (tags[`card.${card}.backDescription`] === undefined) {
                tags[`card.${card}.backDescription`] = ['card', `card${card}`, 'cardBackDescription'];
            }
            if (tags[`card.${card}.explanations`] === undefined) {
                tags[`card.${card}.explanations`] = ['card', `card${card}`, 'cardExplanations', 'markdown'];
            }
        }
    }

    const links = fs.readdirSync('_links');
    for (let link of links) {
        if (link === 'linksStyle.json') continue;
        const langs = fs.readdirSync(`_links/${link}`);
        for (const code of langs) {
            if (code === 'index.md') continue;

            if (translationsByCode[code] === undefined) translationsByCode[code] = {};

            const mdLink = matter(fs.readFileSync(`_links/${link}/${code}/index.md`));

            if (mdLink['content'].trim() === '') translationsByCode[code][`link.${link}.explanations`] = null;
            else translationsByCode[code][`link.${link}.explanations`] = mdLink['content'];

            if (tags[`link.${link}.explanations`] === undefined) {
                tags[`link.${link}.explanations`] = [
                    'link',
                    `link${link}`,
                    `card${mdLink['data'].fromCardId}`,
                    `card${mdLink['data'].toCardId}`,
                    'linkExplanations',
                    'markdown',
                ];
            }
        }
    }

    const fresks = fs.readdirSync('_fresks');
    for (let fresk of fresks) {
        const freskData = JSON.parse(fs.readFileSync(`_fresks/${fresk}`));
        for (let code in freskData.title) {
            if (translationsByCode[code] == undefined) translationsByCode[code] = {};
            const freskId = fresk.slice(0, fresk.length - 5); // Remove .json at the end
            translationsByCode[code][`fresk.${freskId}.title`] = freskData.title[code];
            tags[`fresk.${freskId}.title`] = ['fresk'];
        }
    }

    const settings = JSON.parse(fs.readFileSync('settings.json'));
    for (let key of ['title', 'description', 'fresk-label']) {
        for (let code in settings[key]) {
            if (translationsByCode[code] === undefined) translationsByCode[code] = {};
            translationsByCode[code][`settings.${key}`] = settings[key][code];
            tags[`settings.${key}`] = ['settings'];
        }
    }
    for (let code in settings.i18n) {
        if (translationsByCode[code] === undefined) translationsByCode[code] = {};
        for (let key in settings.i18n[code]) {
            translationsByCode[code][`settings.i18n.${key}`] = settings.i18n[code][key];
            tags[`settings.i18n.${key}`] = ['settings'];
        }
    }
    return { translationsByCode, tags };
};

// Create a file named "cards.json" from all the cards available in cards folder

const fs = require('fs');
const matter = require('gray-matter');

const cardsPlugin = () => ({
    name: 'vite-plugin-cards',
    configResolved(config) {
        if (!fs.existsSync('src/data')) {
            fs.mkdirSync('src/data');
        }
        console.log(`> Create cards.json`);

        const cardFilenames = fs.readdirSync('src/assets/_cards');
        const cards = [];

        for (const cardId of cardFilenames) {
            if (cardId.endsWith('.gitkeep')) continue;

            console.log(`> Parse card ${cardId}`);
            const card = {
                id: cardId,
                langs: [], // list of langs
                // front: [], // list of langs
                // back: [], // list of langs
                content: [], // list of langs
                lot: undefined,
                num: undefined,
                isFrontOnly: false,
                variants: undefined, // list of variants
                youtubeCode: [], // list of langs
                instagramCode: [], // list of langs
                wikiUrl: [], // list of langs
            };

            const langs = fs.readdirSync(`src/assets/_cards/${card.id}`);
            for (const lang of langs) {
                if (lang === 'index.md') {
                    const mdCard = matter(fs.readFileSync(`src/assets/_cards/${card.id}/index.md`));
                    const cardData = mdCard['data'];
                    card.lot = cardData.lot;
                    card.num = cardData.num;
                    if ('isFrontOnly' in cardData) {
                        card.isFrontOnly = cardData.isFrontOnly;
                    }
                    card.variants = cardData.variants;
                    continue;
                }

                // console.log(`>> File ${cardId}/${lang}`);
                card.langs.push(lang);

                const mdCard = matter(fs.readFileSync(`src/assets/_cards/${card.id}/${lang}/index.md`));
                const cardData = mdCard['data'];
                const cardContent = mdCard['content'];
                if (cardContent.trim() !== '') {
                    card.content.push(lang);
                }

                if (cardData.youtubeCode) card.youtubeCode.push(lang);

                if (cardData.instagramCode) card.instagramCode.push(lang);

                if (cardData.wikiUrl) card.wikiUrl.push(lang);
            }
            cards.push(card);
        }

        fs.writeFileSync('src/data/cards.json', JSON.stringify(cards, null, 4));

        console.log(`> Create links.json`);
        const links = [];
        const linksFilenames = fs.readdirSync('src/assets/_links');
        for (const linkId of linksFilenames) {
            if (linkId.endsWith('.gitkeep')) continue;
            if (linkId.endsWith('.json')) continue;

            // console.log(`> Parse link ${ linkId }`)
            const link = {
                id: linkId,
                langs: [],
                fromCardId: undefined,
                toCardId: undefined,
                status: undefined,
                class: undefined,
            };

            const langs = fs.readdirSync(`src/assets/_links/${link.id}`);
            for (const lang of langs) {
                if (lang === 'index.md') continue;
                // console.log(`>> File ${ link.id }/${ linkFile }`);
                link.langs.push(lang);

                const linkData = matter(fs.readFileSync(`src/assets/_links/${link.id}/${lang}/index.md`))['data'];

                if (link.status == undefined) link.status = linkData.status;
                if (linkData.status !== link.status) throw new Error(`Wrong status, should be ${linkData.status} and not ${link.status}`);

                if (link.class == undefined) link.class = linkData.class;
                if (linkData.class !== link.class) throw new Error(`Wrong class, should be ${linkData.class} and not ${link.class}`);

                if (link.fromCardId == undefined) link.fromCardId = linkData.fromCardId;
                if (linkData.fromCardId !== link.fromCardId)
                    throw new Error(`Wrong fromCardId, should be ${linkData.fromCardId} and not ${link.fromCardId}`);

                if (link.toCardId == undefined) link.toCardId = linkData.toCardId;
                if (linkData.toCardId !== link.toCardId) throw new Error(`Wrong toCardId, should be ${linkData.toCardId} and not ${link.toCardId}`);
            }
            links.push(link);
        }
        fs.writeFileSync('src/data/links.json', JSON.stringify(links, null, 4));

        console.log(`> Create fresks.json`);

        const fresks = [];
        const fresksFilenames = fs.readdirSync('src/assets/_fresks');
        for (const freskFilename of fresksFilenames) {
            if (freskFilename.endsWith('.gitkeep')) continue;

            const freskId = freskFilename.slice(0, -5); // Remove .json extension
            console.log(`> Parse fresk ${freskId}`);

            const freskFile = JSON.parse(fs.readFileSync(`src/assets/_fresks/${freskId}.json`));

            const fresk = {
                id: freskId,
                version: freskFile['version'],
                title: freskFile['title'],
                lot: freskFile['lot'],
                variants: freskFile['variants'],
            };
            fresks.push(fresk);
        }
        fs.writeFileSync('src/data/fresks.json', JSON.stringify(fresks, null, 4));

        console.log(`> Create langs.json`);
        const variants = JSON.parse(fs.readFileSync(`variants.json`));
        const allLangs = new Set();
        for (const variant of Object.keys(variants)) {
            for (const lang of Object.keys(variants[variant].langs)) {
                allLangs.add(lang);
            }
        }

        const langsMemoData = [];
        for (let lang of allLangs) {
            const langFile = JSON.parse(fs.readFileSync(`src/i18n/common/${lang}.json`));
            langsMemoData.push({
                code: lang,
                ...langFile['lang'],
            });
        }
        fs.writeFileSync('src/data/langs.json', JSON.stringify(langsMemoData, null, 4));
    },
});

export default cardsPlugin;

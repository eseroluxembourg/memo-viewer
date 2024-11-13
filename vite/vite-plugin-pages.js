// Create a file named "cards.json" from all the cards available in cards folder

const fs = require('fs');
const matter = require('gray-matter');

const cardsPlugin = () => ({
    name: 'vite-plugin-pages',
    configResolved(config) {
        console.log(`> Create pages.json`);

        const pages = {};

        pages['about'] = [];
        const aboutFilenames = fs.readdirSync('src/assets/_pages/about');

        for (const filename of aboutFilenames) {
            if (filename.endsWith('.gitkeep')) continue;
            const lang = filename.slice(0, -3); // remove .md at the end

            pages['about'].push(lang);
        }

        fs.writeFileSync('src/data/pages.json', JSON.stringify(pages, null, 4));
    },
});

export default cardsPlugin;

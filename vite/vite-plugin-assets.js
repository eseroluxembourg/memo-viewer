// Create a file named "assets.json" from all the cards available in cards folder

const fs = require('fs');

const cardsPlugin = () => ({
    name: 'vite-plugin-assets',
    configResolved(config) {
        console.log(`> Create assets.json`);

        const assets = {};

        const logoFilenames = fs.readdirSync('public/local/logo/logo');
        assets['logo'] = {};
        for (const filename of logoFilenames) {
            if (filename === '.gitkeep') continue;
            const lang = filename.slice(0, -4); // remove .png at the end
            // Add / to use absolute path
            assets['logo'][lang] = `/local/logo/logo/${filename}`;
        }

        const previewsFilenames = fs.readdirSync('public/local/previews');
        assets['previews'] = {};
        for (const filename of previewsFilenames) {
            if (filename === '.gitkeep') continue;
            const lang = filename.slice(0, -4); // remove .png at the end
            // Add / to use absolute path
            assets['previews'][lang] = `/local/previews/${filename}`;
        }

        assets['logo-esero'] = {};
        for (const filename of logoFilenames) {
            if (filename === '.gitkeep') continue;
            const lang = filename.slice(0, -4); // remove .png at the end
            // Add / to use absolute path
            assets['logo-esero'][lang] = `/local/spacearea/ESERO_logo.png`;
        }

        fs.writeFileSync('src/data/assets.json', JSON.stringify(assets, null, 4));
    },
});

export default cardsPlugin;

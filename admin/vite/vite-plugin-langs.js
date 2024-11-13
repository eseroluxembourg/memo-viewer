// Create a file named "cards.json" from all the langs found in i18n/common
import fs from 'fs';

const langsPlugin = () => ({
    name: 'vite-plugin-assets',
    configResolved(config) {
        console.log(`> Create langs.json`);

        const langs = [];

        const langsFiles = fs.readdirSync('src/i18n/common');
        for (const filename of langsFiles) {
            const lang = filename.slice(0, -5); // remove .json at the end
            const langFile = JSON.parse(fs.readFileSync(`../src/i18n/common/${lang}.json`));
            langs.push({
                code: lang,
                ...langFile['lang'],
            });
        }

        fs.writeFileSync('src/data/langs.json', JSON.stringify(langs, null, 4));
    },
});

export default langsPlugin;

const fs = require('fs');
const semver = require('semver');
const matter = require('gray-matter');

const settings = JSON.parse(fs.readFileSync('settings.json'));
const memoPackage = JSON.parse(fs.readFileSync('memo-viewer/package.json'));

const memoDependency = settings['memo'] && settings['memo']['version'] ? settings['memo']['version'] : '1.4.2';

const memoViewer = memoPackage['version'];

function updateVersion(version) {
    if (settings['memo'] === undefined) settings['memo'] = {};
    settings['memo']['version'] = version;
    fs.writeFileSync('settings.json', JSON.stringify(settings, null, 4));
}

/**
 * Update file architectures to use inde files.
 * _cards/<cardid>/<lang>.md --> _cards/<cardid>/<lang>/index.md
 * It was usefull for DecapCMS
 */
function migrate1_4_3() {
    console.log('> Migrate to 1.4.3');

    console.log('>> Update package.json');
    const packageFile = JSON.parse(fs.readFileSync('package.json'));
    packageFile['scripts']['dev:admin'] = 'npm run setup:data && cd memo-viewer && npm run dev:admin';
    packageFile['scripts']['preview:admin'] = 'npm run setup:data && cd memo-viewer && npm run preview:admin';
    packageFile['scripts']['build:admin'] = 'npm run setup:data && cd memo-viewer && npm run build:admin';
    fs.writeFileSync('package.json', JSON.stringify(packageFile, null, 4));

    console.log('>> Update settings.json');
    updateVersion('1.4.3');

    console.log('>> Move cards');
    const cardFilenames = fs.readdirSync('_cards');
    for (const cardId of cardFilenames) {
        if (cardId.endsWith('.gitkeep')) continue;

        const langs = fs.readdirSync(`_cards/${cardId}`);
        console.log(langs);
        for (const cardFile of langs) {
            const lang = cardFile.slice(0, -3); // remove .md at the end
            fs.mkdirSync(`_cards/${cardId}/${lang}`);
            fs.renameSync(`_cards/${cardId}/${lang}.md`, `_cards/${cardId}/${lang}/index.md`);
        }
        fs.writeFileSync(`_cards/${cardId}/index.md`, '');
    }

    console.log('>> Move links');
    const linksFilenames = fs.readdirSync('_links');
    for (const linkId of linksFilenames) {
        if (linkId.endsWith('.gitkeep')) continue;

        const langs = fs.readdirSync(`_links/${linkId}`);
        for (const linkFile of langs) {
            const lang = linkFile.slice(0, -3); // remove .md at the end
            fs.mkdirSync(`_links/${linkId}/${lang}`);
            fs.renameSync(`_links/${linkId}/${lang}.md`, `_links/${linkId}/${lang}/index.md`);
        }
        fs.writeFileSync(`_links/${linkId}/index.md`, '');
    }
}

function migrate1_5_0() {
    console.log('> Migrate to 1.5');

    console.log('>> Update package.json');
    const packageFile = JSON.parse(fs.readFileSync('package.json'));
    packageFile['scripts']['dev:admin'] = 'npm run setup:data && cd memo-viewer && npm run dev:admin';
    fs.writeFileSync('package.json', JSON.stringify(packageFile, null, 4));

    console.log('>> Update settings.json');
    updateVersion('1.5.0');

    console.log('>> Remove cards / index.md');
    const cardFilenames = fs.readdirSync('_cards');
    for (const cardId of cardFilenames) {
        if (cardId.endsWith('.gitkeep')) continue;

        if (fs.existsSync(`_cards/${cardId}/index.md`)) {
            fs.rmSync(`_cards/${cardId}/index.md`);
        }
    }

    console.log('>> Remove links / index.md');
    const linkFilenames = fs.readdirSync('_links');
    for (const linkId of linkFilenames) {
        if (linkId.endsWith('.gitkeep')) continue;

        if (fs.existsSync(`_links/${linkId}/index.md`)) {
            fs.rmSync(`_links/${linkId}/index.md`);
        }
    }

    // TODO add project_id field 99817
}

/**
 * Change field lot from int to string
 */
function migrate1_6_4() {
    console.log('> Migrate to 1.6.4');
    updateVersion('1.6.4');

    const cardFilenames = fs.readdirSync('_cards');
    for (const cardId of cardFilenames) {
        if (cardId.endsWith('.gitkeep')) continue;

        const langs = fs.readdirSync(`_cards/${cardId}`);

        for (const lang of langs) {
            const filename = `_cards/${cardId}/${lang}/index.md`;

            const card = matter(fs.readFileSync(filename, 'utf-8'));
            card.data.lot = card.data.lot.toString();
            fs.writeFileSync(filename, matter.stringify(card));
        }
    }
}

/**
 * Create _cards/<cardId>/index.md file with num, tags and lot
 * Remove num and lot from _cards/<cardId>/<i18n>/index.md files
 */
function migrate1_7_0() {
    console.log('> Migrate to 1.7.0');
    const defaultVariant = process.env.DEFAULT_VARIANT || 'latest';
    const allLangs = new Set();

    const cardFilenames = fs.readdirSync('_cards');
    for (const cardId of cardFilenames) {
        if (cardId.endsWith('.gitkeep')) continue;

        const langs = fs.readdirSync(`_cards/${cardId}`);
        const commonData = {
            data: {
                lot: undefined,
                num: undefined,
                variants: [defaultVariant],
            },
            content: '\n',
        };
        for (const lang of langs) {
            if (lang === 'index.md') continue;
            const filename = `_cards/${cardId}/${lang}/index.md`;
            allLangs.add(lang);
            const card = matter(fs.readFileSync(filename, 'utf-8'));
            commonData.data.lot = card.data.lot;
            commonData.data.num = card.data.num;

            delete card.data.num;
            delete card.data.lot;
            fs.writeFileSync(filename, matter.stringify(card));
        }
        fs.writeFileSync(`_cards/${cardId}/index.md`, matter.stringify(commonData));
    }

    const variants = {
        [defaultVariant]: {
            default: true,
            deprecated: false,
            langs: {},
        },
    };

    for (const lang of allLangs) {
        variants[defaultVariant].langs[lang] = {
            url: '',
            format: '',
            replacements: '',
        };
    }
    fs.writeFileSync('variants.json', JSON.stringify(variants, null, 4));

    const freskFilenames = fs.readdirSync('_fresks');
    for (const freskFilename of freskFilenames) {
        if (freskFilename.endsWith('.gitkeep')) continue;

        // name was fresk_{id}.json

        const fresk = JSON.parse(fs.readFileSync(`_fresks/${freskFilename}`, 'utf-8'));

        let lotId = freskFilename.slice(6, freskFilename.length - 5);
        fresk['lot'] = lotId;

        fresk['variants'] = [defaultVariant];
        fs.writeFileSync(`_fresks/${freskFilename}`, JSON.stringify(fresk, null, 4));
    }

    const linkIds = fs.readdirSync('_links');
    for (const linkId of linkIds) {
        if (linkId.endsWith('.gitkeep')) continue;

        const langs = fs.readdirSync(`_links/${linkId}`);
        for (const lang of langs) {
            if (lang === 'index.md') continue;
            const filename = `_links/${linkId}/${lang}/index.md`;
            const link = matter(fs.readFileSync(filename, 'utf-8'));
            link.data.fromCardId = `${link.data.fromCardId}`;
            link.data.toCardId = `${link.data.toCardId}`;
            delete link.data.linkId;
            fs.writeFileSync(filename, matter.stringify(link));
        }
    }

    const dataPackage = JSON.parse(fs.readFileSync('package.json'));
    dataPackage['scripts']['test'] = 'npm run setup:data && cd memo-viewer && npm run test';
    fs.writeFileSync('package.json', JSON.stringify(dataPackage, null, 4));

    delete settings['gitlab']['app_id'];
    fs.writeFileSync('settings.json', JSON.stringify(settings, null, 4));
    updateVersion('1.7.0');
}

/**
 *
 */
function migrate1_9_0() {
    fs.writeFileSync('_links/linksStyle.json', JSON.stringify({}, null, 4));
    updateVersion('1.9.0');
}

const migrations = {
    '1.4.3': migrate1_4_3,
    '1.5.0': migrate1_5_0,
    '1.6.4': migrate1_6_4,
    '1.7.0': migrate1_7_0,
    '1.9.0': migrate1_9_0,
};

for (let version of Object.keys(migrations)) {
    if (semver.lte(version, memoDependency)) continue;
    if (semver.gt(version, memoViewer)) continue;
    migrations[version]();
}

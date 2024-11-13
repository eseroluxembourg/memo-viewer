// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { exec } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const toAbsolute = (p) => path.resolve(__dirname, p);

const manifest = JSON.parse(fs.readFileSync(toAbsolute('dist/static/ssr-manifest.json'), 'utf-8'));
const { render } = await import('./dist/server/entry-server.mjs');

const template = fs.readFileSync(toAbsolute('dist/static/app.html'), 'utf-8');
const variants = JSON.parse(fs.readFileSync('variants.json'), 'utf-8');
const cards = JSON.parse(fs.readFileSync(`src/data/cards.json`), 'utf-8');

const withoutLang = ['/', '/cards/grid', '/cards/list', '/cards/network', '/cards/quiz', '/about'];

let paths = process.argv.slice(2);

if (paths.length === 0) {
    for (const card of cards) {
        withoutLang.push('/card/' + card.id);
    }

    paths.push('/');
    for (const variant in variants) {
        // if (variants[variant].deprecated) continue;
        for (const lang in variants[variant].langs) {
            paths = paths.concat(
                withoutLang.map((path) => {
                    return '/' + lang + '/' + variant + path;
                }),
            );
        }
    }
}

(async () => {
    // pre-render each route...
    const BLOCK_SIZE = 50;
    const CONCURRENCY_BATCH = 2;
    if (paths.length > BLOCK_SIZE) {
        let k = 0;
        while (k < paths.length / BLOCK_SIZE) {
            let promises = [];
            for (let i = 0; i < CONCURRENCY_BATCH; ++i) {
                let e = k;
                if (paths.slice(e * BLOCK_SIZE, (e + 1) * BLOCK_SIZE).length === 0) break;
                promises.push(
                    new Promise((resolve) =>
                        exec(`node prerender.mjs ${paths.slice(e * BLOCK_SIZE, (e + 1) * BLOCK_SIZE).join(' ')}`, (x, y, z) => {
                            console.log(`Block ${1 + e} / ${Math.ceil(paths.length / BLOCK_SIZE)} done`);
                            resolve();
                        }),
                    ),
                );
                ++k;
            }
            await Promise.all(promises);
        }
    } else {
        let k = 0;
        for (const url of paths) {
            const [appHtml, preloadLinks, state, metaTags] = await render(url, manifest);
            k += 1;

            let html = template.replace(`<!--preload-links-->`, preloadLinks).replace(`'<pinia-store>'`, state).replace(`<!--app-html-->`, appHtml);

            for (const metaTag in metaTags) {
                html = html.replace(metaTag, metaTags[metaTag]);
            }

            let filePath = `dist/static${url.slice(-1) === '/' ? url + '/index' : url}.html`;
            filePath = filePath.replace('//', '/');

            fs.mkdirSync(filePath.split('/').slice(0, -1).join('/'), { recursive: true });
            fs.writeFileSync(toAbsolute(filePath), html);
        }
    }

    for (const url of paths) {
        let filePath = `dist/static${url.slice(-1) === '/' ? url + '/index' : url}.html`;
        filePath = filePath.replace('//', '/');
        if (!fs.existsSync(filePath.split('/').slice(0, -1).join('/'))) throw new Error(`${filePath} does not exist`);
    }

    // done, delete ssr manifest
})();

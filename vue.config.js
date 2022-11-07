const langs = require('./src/data/langs.json');
const nbCards = require('./src/data/cards.json').length;
const path = require('path');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const settings = require('./settings.json');

const withoutLang = [
  { path: '/' },
  { path: '/game/grid' },
  { path: '/game/list' },
  { path: '/game/view' },
  { path: '/game/network' },
  { path: '/game/quiz' },
  { path: '/langs' },
  { path: '/about' },
];

for (let k = 1; k <= nbCards; ++k) {
  withoutLang.push({ path: '/cards/' + k });
}

let paths = [];

for (const lang of langs) {
  paths = paths.concat(
    withoutLang.map((path) => {
      return { path: '/' + lang.code + path.path };
    })
  );
}
paths = paths.concat(
  withoutLang.map((path) => {
    return { path: '/' + 'en' + path.path };
  })
);
paths = paths.concat(
  withoutLang.map((path) => {
    return { path: '/' + 'fr' + path.path };
  })
);

paths.push({ path: '/' });

const publicPath = process.env.NODE_ENV === 'production' ? '/memo' : '/';
const host =
  process.env.NODE_ENV === 'production' ? settings.host : 'localhost';

module.exports = {
  chainWebpack: (config) => {
    config.plugin('copy').tap(([options]) => {
      options[0].ignore.push('*.gitkeep');
      return [options];
    });
  },
  devServer: {
    host,
  },
  publicPath,
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: settings.title,
        url: settings.host + publicPath,
        siteName: settings.host.slice(8),
        author: settings.author,
      }),
      // new FaviconsWebpackPlugin({
      //   logo: './public/logo/logo-simple.png',
      //   manifest: './public/manifest.json',
      //   favicons: {
      //     appName: settings.title,
      //     background: '#ddd',
      //     theme_color: '#333',
      //     icons: {
      //       coast: false,
      //       yandex: false,
      //     },
      //   },
      // }),
      new SitemapPlugin({
        base: settings.host,
        paths: paths.map((path) => ({
          path: (publicPath == '/' ? '' : publicPath) + path.path,
        })),
        options: {
          filename: 'sitemap.xml',
          lastmod: true,
        },
      }),
    ],
  },
  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: paths.map((path) => path.path),
      useRenderEvent: true,
      headless: true,
      onlyProduction: true,
      maxConcurrentRoutes: 24,
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        keepClosingSlash: true,
        sortAttributes: true,
      },
      // TODO bug avec webpack 5 (voir https://www.npmjs.com/package/@dreysolano/prerender-spa-plugin)
      postProcess(renderedRoute) {
        // Ignore any redirects.
        renderedRoute.route = renderedRoute.originalRoute;
        // Remove /index.html from the output path if the dir name ends with a .html file extension.
        // For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
        if (renderedRoute.route.endsWith('.html')) {
          renderedRoute.outputPath = path.join(
            __dirname,
            'dist',
            renderedRoute.route
          );
        } else {
          renderedRoute.outputPath = path.join(
            __dirname,
            'dist',
            renderedRoute.route,
            'index.html'
          );
        }
        return renderedRoute;
      },
    },
  },
};

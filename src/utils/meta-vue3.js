import { host } from '@/../settings.json';

const HOST = host;

const setTitle = (val) => {
    if (import.meta.env.SSR) return;
    document.title = val;
    setOgTitle(val);
    setMetaName('twitter:title', val);
};
const setOgTitle = (val) => {
    setMetaProp('og:title', val);
};

const setDescription = (val) => {
    setMetaName('description', val);
    setOgDescription(val);
    setTwDescription(val);
};

const setOgDescription = (val) => {
    setMetaProp('og:description', val);
};
const setTwDescription = (val) => {
    setMetaName('twitter:description', val);
};

const setImage = (image) => {
    setMetaProp('og:type', 'website');
    setMetaProp('og:image', HOST + image);
    setMetaName('twitter:image', HOST + image);
};

const setOgLocale = (val) => {
    if (import.meta.env.SSR) return;
    setMetaProp('og:locale', val);

    const el = document.querySelector('html');
    if (el) el.setAttribute('lang', val);
    else console.error('html element not found.');
};
const setOgSiteName = (val) => {
    setMetaProp('og:site_name', val);
};
const setOgUrl = (val) => {
    setMetaProp('og:url', HOST + val);
};

const setMetaName = (selector, val) => {
    if (import.meta.env.SSR) return;
    const el = document.querySelector(`meta[name="${selector}"]`);
    if (el) el.setAttribute('content', val);
    else console.error(`element with name '${selector}' not found.`);
};

const setMetaProp = (selector, val) => {
    if (import.meta.env.SSR) return;
    const el = document.querySelector(`meta[property="${selector}"]`);
    if (el) el.setAttribute('content', val);
    else console.error(`element with property '${selector}' not found.`);
};

export default {
    setTitle,
    setDescription,
    setOgLocale,
    setOgSiteName,
    setOgUrl,
    setImage,
};

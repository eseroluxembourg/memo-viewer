import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import { noScroll, scrollToCard, scrollToTop, scrollToHash } from '@/router/scroll';
import { isLinkToCardDetail, isLinkBackToCardList } from '@/router/nav';
import RouterView from '@/components/site/RouterView.vue';
// import variants from '@/../variants.json';
import _variants from '@/../variants.json';
const defaultVersion = "v9.0";
const variants = {};
variants[defaultVersion] = _variants[defaultVersion];
import langs from '@/data/langs.json';

const routes = [
    {
        path: '',
        name: 'RouteHome',
        props: true,
        redirect: (to) => {
            return {
                name: 'RouteCards',
                params: {
                    ...to.params,
                    // view: 'grid',
                    view: 'network',
                },
            };
        },
    },
    {
        path: 'cards/:view',
        name: 'RouteCards',
        props: true,
        component: () => import('@/pages/AllCards.vue'),
    },
    {
        path: 'card/:cardId',
        name: 'RouteCardDetails',
        props: true,
        component: () => import('@/pages/Card.vue'),
    },
    {
        path: 'about',
        name: 'RouteAbout',
        component: () => import('@/pages/About.vue'),
    },
    {
        name: 'error',
        path: ':pathMatch(.*)*',
        redirect: { name: 'RouteHome' },
    },
];

const scrollBehavior = (to, from) => {
    if (to.hash === '#top') {
        return scrollToTop();
    }

    if (to.hash) {
        return scrollToHash(to.hash);
    }

    if (isLinkToCardDetail(to)) {
        return scrollToTop();
    }

    if (isLinkBackToCardList(to, from)) {
        return scrollToCard(from.params.cardNum);
    }

    return noScroll;
};

export function createRouter() {
    return _createRouter({
        // use appropriate history implementation for server/client
        // import.meta.env.SSR is injected by Vite.
        history: import.meta.env.SSR ? createMemoryHistory(import.meta.env.BASE_URL) : createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                name: 'main',
                path: `/:lang(${langs.map((lang) => lang.code).join('|')})?/:version(${Object.keys(variants).join('|')})?/`,
                // path: `/:lang(${langs.map((lang) => lang.code).join('|')})?/`,
                component: RouterView,
                children: routes,
            },
        ],
        scrollBehavior,
    });
}

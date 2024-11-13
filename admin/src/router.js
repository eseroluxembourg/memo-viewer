import { createRouter as _createRouter, createWebHashHistory } from 'vue-router';

import RouterView from '@/components/RouterView.vue';

const routes = [
    {
        path: '',
        name: 'RouteHome',
        props: false,
        component: () => import('@/pages/Home.vue'),
    },
    {
        path: 'cards/',
        name: 'RouteCards',
        props: false,
        component: () => import('@/pages/Cards.vue'),
    },
    {
        path: 'card/:cardId',
        name: 'RouteCard',
        props: true,
        component: () => import('@/pages/Card.vue'),
    },
    {
        path: 'links/',
        name: 'RouteLinks',
        props: false,
        component: () => import('@/pages/Links.vue'),
    },
    {
        path: 'link/:linkId',
        name: 'RouteLink',
        props: true,
        component: () => import('@/pages/Link.vue'),
    },
    {
        path: 'settings',
        name: 'RouteSettings',
        component: () => import('@/pages/Settings.vue'),
    },
    {
        path: 'variants',
        name: 'RouteVariants',
        component: () => import('@/pages/Variants.vue'),
    },
    {
        path: 'variant/:variantId',
        name: 'RouteVariant',
        props: true,
        component: () => import('@/pages/Variant.vue'),
    },
    {
        path: 'fresks',
        name: 'RouteFresks',
        props: false,
        component: () => import('@/pages/Fresks.vue'),
    },
    {
        path: 'fresk/:freskId',
        name: 'RouteFresk',
        props: true,
        component: () => import('@/pages/Fresk.vue'),
    },
    {
        path: 'pdfformat/:pdfFormatId',
        name: 'RoutePdfFormat',
        props: true,
        component: () => import('@/pages/PdfFormat.vue'),
    },
    {
        path: 'save',
        name: 'RouteSave',
        props: false,
        component: () => import('@/pages/Save.vue'),
    },
    {
        path: 'ci',
        name: 'RouteCI',
        props: false,
        component: () => import('@/pages/CI.vue'),
    },
];

export function createRouter() {
    return _createRouter({
        history: createWebHashHistory(import.meta.env.BASE_URL),
        routes: [
            {
                name: 'main',
                path: '/:lang?/',
                component: RouterView,
                children: routes,
            },
        ],
    });
}

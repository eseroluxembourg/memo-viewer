<script setup>
import Navbar from './components/Navbar.vue';
import CardsIcon from '!/src/components/icons/CardsIcon.vue';
import { ArchiveBoxArrowDownIcon } from '@heroicons/vue/24/outline';

import { useLinksStore } from '@/store/links';
import { useFresksStore } from '@/store/fresks';
import { useCardsStore } from '@/store/cards';
import { useGitlabStore } from '@/store/gitlab';
import { useVariantsStore } from '@/store/variants';
import { useSettingsStore } from '@/store/settings';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { guessLanguage } from '!/src/utils/i18n';
import { useI18n } from 'vue-i18n';

const linksStore = useLinksStore();
const cardsStore = useCardsStore();
const variantsStore = useVariantsStore();
const fresksStore = useFresksStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

onMounted(() => {
    const lang = guessLanguage(route.params.lang);
    if (lang !== route.params.lang) {
        router.replace({ name: route.name, params: { ...route.params, lang } });
    }

    useGitlabStore().pull();
});
</script>

<template>
    <div>
        <div class="h-screen overflow:scroll flex flex-row flex-wrap">
            <div class="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content flex flex-col items-center">
                    <Navbar />
                    <router-view></router-view>
                </div>
                <div class="drawer-side z-40">
                    <label for="my-drawer-2" class="drawer-overlay"></label>
                    <div class="sticky top-0 z-20 bg-white w-80 text-sm">
                        <div>
                            <router-link :to="{ name: 'RouteHome', params: { lang: locale } }" class="btn btn-ghost normal-case">
                                <CardsIcon class="w-6 h-6" />
                                <span class="md:visible invisible">Memo CMS / {{ settingsStore.freskLabel(locale) }}</span>
                            </router-link>
                        </div>
                    </div>
                    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        <!-- Sidebar content here -->
                        <li class="lg:mt-0 mt-10">
                            <router-link :to="{ name: 'RouteCards', params: { lang: locale } }">
                                <div class="indicator">
                                    <!-- <span v-if="cardsStore.flatModifications.length > 0" class="indicator-item badge badge-primary">{{ cardsStore.flatModifications.length }}</span> -->
                                    {{ t('cards.label') }}
                                    <span v-if="cardsStore.loading" class="loading loading-dots loading-md"></span>
                                </div>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'RouteLinks', params: { lang: locale } }">
                                {{ t('links.label') }}
                                <span v-if="linksStore.loading" class="loading loading-dots loading-md"></span>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'RouteFresks', params: { lang: locale } }">{{ t('fresks.label') }}</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'RouteVariants', params: { lang: locale } }">{{ t('variants.label') }}</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'RouteSettings', params: { lang: locale } }">{{ t('configuration.label') }}</router-link>
                        </li>
                        <li></li>
                        <li>
                            <router-link
                                v-if="!cardsStore.loading && !linksStore.loading && !fresksStore.loading && !variantsStore.loading"
                                :class="{
                                    'btn text-xs btn-sm btn-outline': true,
                                    'btn-ghost':
                                        !cardsStore.hasModifications &&
                                        !linksStore.hasModifications &&
                                        !fresksStore.hasModifications &&
                                        !variantsStore.hasModifications,
                                    'btn-success':
                                        cardsStore.hasModifications ||
                                        linksStore.hasModifications ||
                                        fresksStore.hasModifications ||
                                        variantsStore.hasModifications,
                                }"
                                tag="button"
                                :to="{ name: 'RouteSave', params: { lang: locale } }">
                                <span class="hidden md:inline">{{ t('navbar.publish') }}</span>
                                <ArchiveBoxArrowDownIcon class="w-4 h-4" />
                            </router-link>
                        </li>
                        <!-- <li>
                <router-link :to="{ name: 'RouteCI', params: { lang: locale }}">
                    Mise en production
                </router-link>
            </li> -->
                        <li></li>
                        <li><a href="https://memo.fresque.earth" target="_blank" class="link">Documentation</a></li>
                        <li><a href="https://framagit.org/memo-fresques" target="_blank" class="link">Code source</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

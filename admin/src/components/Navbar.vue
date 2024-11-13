<script setup>
import { ref, computed } from 'vue';
import { InformationCircleIcon, ArchiveBoxArrowDownIcon, LanguageIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useSettingsStore } from '@/store/settings';
import { useGitlabStore } from '@/store/gitlab';
import { useCardsStore } from '@/store/cards';
import { useLinksStore } from '@/store/links';
import { useFresksStore } from '@/store/fresks';
import { useVariantsStore } from '@/store/variants';
import langs from '@/data/langs.json';
import { languageString } from '!/src/utils/i18n.js';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const settings = useSettingsStore();
const cardsStore = useCardsStore();
const linksStore = useLinksStore();
const fresksStore = useFresksStore();
const variantsStore = useVariantsStore();
const gitlabStore = useGitlabStore();
const router = useRouter();
const { locale } = useI18n();

const tokenStatus = ref('');

const gitlabToken = computed({
    get: () => gitlabStore.gitlabToken,
    set: (newValue) => gitlabStore.setGitlabToken(newValue),
});

const gitlabBranch = computed({
    get: () => settings._state['branch'],
    set: (newValue) => {
        settings.setGitlabBranch(newValue);
        gitlabStore.pull();
    },
});

function resetCache() {
    gitlabStore.resetCache();
}

function changeLang(newLang) {
    router.push({ params: { lang: newLang } });
}
</script>

<template>
    <div class="sticky top-0 z-30 h-16 w-full">
        <nav class="navbar bg-base-100 flex justify-end">
            <div class="navbar-start">
                <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </div>
            <div class="navbar-end">
                <div v-if="gitlabStore.errorMessage !== '' || tokenStatus == 'input-error'" class="dropdown dropdown-end dropdown-hover">
                    <label tabindex="0" class="mx-3">
                        <span class="badge badge-error gap-2"> error </span>
                    </label>
                    <div tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-96">
                        <div class="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span v-if="tokenStatus == 'input-success'">{{ gitlabStore.errorMessage }}</span>
                            <span v-else>Token non renseigné, faux ou non autorisé.</span>
                        </div>
                    </div>
                </div>
                <router-link
                    v-if="$route.name !== 'RouteSave'"
                    :class="{
                        'btn btn-success text-xs btn-outline': true,
                        'btn-disabled':
                            !cardsStore.hasModifications &&
                            !linksStore.hasModifications &&
                            !fresksStore.hasModifications &&
                            !variantsStore.hasModifications,
                    }"
                    tag="button"
                    :to="{ name: 'RouteSave', params: { lang: locale } }">
                    <span class="hidden md:inline">{{ $t('navbar.publish') }}</span>
                    <ArchiveBoxArrowDownIcon class="w-4 h-4" />
                </router-link>

                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                        <InformationCircleIcon class="w-5 h-5 rounded-full" />
                    </label>
                    <div tabindex="0" class="mt-3 z-[1] card card-compact dropdown-content w-82 bg-base-100 shadow">
                        <div class="card-body">
                            <label class="label">
                                <span class="label-text">{{ $t('navbar.gitlabToken') }}</span>
                            </label>
                            <input
                                type="text"
                                placeholder="glpat-xxxxx"
                                :class="`input input-bordered w-full max-w-xs ${tokenStatus}`"
                                v-model="gitlabToken" />
                            <label class="label">
                                <span class="label-text">{{ $t('navbar.gitlabBranch') }}</span>
                            </label>
                            <input type="text" placeholder="main" class="input input-bordered w-full max-w-xs" v-model="gitlabBranch" />
                            <span class="my-1">{{ $t('navbar.lastcommit') }}{{ gitlabStore.commit }} </span>
                            <span class="my-1">{{ $t('navbar.memoversion') }}{{ settings.memoVersion }} </span>

                            <div class="card-actions">
                                <button class="btn btn-xs text-xs" @click="resetCache">{{ $t('navbar.resetcache') }}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dropdown dropdown-end">
                    <div class="btn btn-ghost normal-case" tabindex="0">
                        <LanguageIcon class="w-5 h-5" />
                        <ChevronDownIcon class="w-2 h2" />
                    </div>

                    <div class="bg-base-200 dropdown-content text-base-content rounded-box top-px mt-16 w-56">
                        <div class="menu menu-sm gap-1" tabindex="0">
                            <button
                                v-for="lang in langs"
                                :key="lang.code"
                                :class="{ 'btn btn-ghost btn-xs': true, 'btn-active': locale === lang.code }"
                                @click="changeLang(lang.code)">
                                {{ languageString(lang.code) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div v-if="gitlabStore.displaySuccessAlertToken" role="alert" class="alert alert-success absolute bottom-0 mb-10 w-[90vw] left-[5vw] z-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Vous êtes désormais correctement authentifié·e !</span>
    </div>
</template>

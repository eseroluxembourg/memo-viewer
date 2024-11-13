<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

import { useCardsStore } from '@/store/cards';
import { useVariantsStore } from '@/store/variants';
import UndoField from '@/components/UndoField.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import LangSelect from '@/components/LangSelect.vue';
import { useI18n } from 'vue-i18n';
const cardsStore = useCardsStore();
const variantsStore = useVariantsStore();

variantsStore.fetchVariants();
const { locale } = useI18n();
</script>

<template>
    <div class="container mx-auto">
        <form v-if="card !== undefined && !cardsStore.loadingCard" class="px-10">
            <div class="flex justify-between">
                <router-link
                    :to="{ name: 'RouteCard', params: { lang: locale, cardId: cardsStore.previousCardId(cardId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    <ChevronLeftIcon class="w-4 h-4" />{{ $t('card.previousCard') }}
                </router-link>

                <button class="btn btn-ghost text-xs" @click="createCard">{{ $t('card.create') }}</button>

                <router-link
                    :to="{ name: 'RouteCard', params: { lang: locale, cardId: cardsStore.nextCardId(cardId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    {{ $t('card.nextCard') }} <ChevronRightIcon class="w-4 h-4" />
                </router-link>
            </div>

            <h1 class="text-3xl font-semibold text-gray-900">{{ $t('card.label', { cardId: card.id.value }) }}</h1>
            <div class="form-control w-full grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8">
                <div class="col-span-3 col-start-1">
                    <label class="label">
                        <span class="label-text">Identifiant de la Carte (⚠️ ne peut pas commencer par un _)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        :class="{
                            'input input-bordered w-full': true,
                        }"
                        v-model="cardIdValue" />
                </div>
                <UndoField class="col-span-1" v-if="card.id !== undefined && card.id.changed" @click="cardIdValue = undefined" />

                <div class="col-start-1 col-span-3 tooltip tooltip-right">
                    <label class="label">
                        <span class="label-text">{{ $t('card.lotNumber') }}</span>
                    </label>
                    <div class="join w-full">
                        <select :disabled="customLot !== ''" class="join-item select select-bordered w-full" v-model="cardLot">
                            <option v-for="(lot, key) in cardsStore.lots" :key="key">{{ lot }}</option>
                        </select>
                        <input class="join-item input input-bordered w-20" type="text" :placeholder="$t('common.new')" v-model="customLot" />
                    </div>
                </div>
                <UndoField v-if="card.lot.changed" class="col-span-1" @click="cardLot = undefined" />

                <div class="col-span-3 col-start-1 md:col-start-5">
                    <label class="label">
                        <span class="label-text">{{ $t('card.cardNumber') }}</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        v-model="cardNum"
                        :class="{ 'input input-bordered w-full': true, 'input-accent': card.num.changed }" />
                </div>
                <UndoField class="col-span-1" v-if="card.num.changed" @click="cardNum = undefined" />

                <div class="col-span-3 md:col-span-2">
                    <label class="label">
                        <span class="label-text">{{ $t('card.isFrontOnly') }}</span>
                    </label>
                    <input type="checkbox" class="toggle" v-model="isFrontOnly" />
                </div>

                <div class="col-span-7 col-start-1">
                    <label class="label">
                        <span class="label-text">{{ $t('card.variants') }}</span>
                    </label>
                    <div
                        v-for="(variant, key) in variantsStore.variantIds"
                        :key="key"
                        :class="{ 'mx-1 badge badge-lg cursor-pointer': true, 'badge-success': card.variants.value.includes(variant) }"
                        @click="switchVariant(variant)">
                        <span class="label-text">{{ variant }}</span>
                    </div>
                </div>
                <UndoField
                    v-if="card.variants.changed"
                    class="col-span-1"
                    @click="cardsStore.setModification(cardId, undefined, 'variants', undefined)" />

                <div class="divider w-full col-span-2 md:col-start-3 col-start-2 md:col-span-4"></div>
                <div class="col-span-3">
                    <label class="label">
                        <span class="label-text">{{ $t('common.langToEdit') }}</span>
                    </label>
                    <LangSelect :langs="card.langs" :availableLangs="cardsStore.langs" v-model="activeLang" />
                </div>

                <div class="col-span-3 md:col-span-2">
                    <label class="label">
                        <span class="label-text">{{ $t('card.front') }}</span>
                    </label>
                    <img :src="cardsStore.cardImage(cardIdValue, activeLang, variantsStore.defaultVariant, 'front')" />
                    <p class="w-full text-xs mt-5 italic">{{ $t('card.notEditableInCMS') }}</p>
                </div>

                <div class="col-span-3 md:col-span-2" v-if="!isFrontOnly">
                    <label class="label">
                        <span class="label-text">{{ $t('card.back') }}</span>
                    </label>
                    <img :src="cardsStore.cardImage(cardIdValue, activeLang, variantsStore.defaultVariant, 'back')" />
                    <p class="w-full text-xs mt-5 italic">{{ $t('card.notEditableInCMS') }}</p>
                </div>

                <template v-if="activeLang !== undefined">
                    <div class="md:col-span-7 col-span-3">
                        <label class="label">
                            <span class="label-text">{{ $t('card.cardTitle') }}</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            :class="{
                                'input input-bordered w-full': true,
                                'input-accent': card.title[activeLang] !== undefined && card.title[activeLang].changed,
                            }"
                            v-model="cardTitle" />
                    </div>
                    <UndoField
                        class="col-span-1"
                        v-show="card.title[activeLang] !== undefined && card.title[activeLang].changed"
                        @click="cardTitle = undefined" />

                    <MarkdownEditor
                        class="md:col-span-7 col-span-3"
                        :label="$t('card.backText')"
                        :accent="card.backDescription[activeLang] !== undefined && card.backDescription[activeLang].changed"
                        v-model="cardBackDescription" />

                    <UndoField
                        class="col-span-1"
                        v-if="card.backDescription[activeLang] !== undefined && card.backDescription[activeLang].changed"
                        @click="cardBackDescription = undefined" />

                    <MarkdownEditor
                        class="md:col-span-7 col-span-3"
                        :label="$t('card.cardExplanations')"
                        v-model="cardContent"
                        :accent="card.cardContent[activeLang] !== undefined && card.cardContent[activeLang].changed" />
                    <UndoField
                        class="col-span-1"
                        v-if="card.cardContent[activeLang] !== undefined && card.cardContent[activeLang].changed"
                        @click="cardContent = undefined" />

                    <div class="col-span-3">
                        <label class="label">
                            <span class="label-text">{{ $t('card.wiki') }}</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            v-model="cardWiki"
                            :class="{
                                'input input-bordered w-full': true,
                                'input-accent': card.wikiUrl[activeLang] !== undefined && card.wikiUrl[activeLang].changed,
                            }" />
                    </div>
                    <UndoField
                        class="col-span-1"
                        v-show="card.wikiUrl[activeLang] !== undefined && card.wikiUrl[activeLang].changed"
                        @click="cardWiki = undefined" />

                    <div class="col-span-3 col-start-1 md:col-start-5">
                        <label class="label">
                            <span class="label-text">{{ $t('card.youtubeCode') }}</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            v-model="cardYoutube"
                            :class="{
                                'input input-bordered w-full': true,
                                'input-accent': card.youtubeCode[activeLang] !== undefined && card.youtubeCode[activeLang].changed,
                            }" />
                    </div>
                    <UndoField
                        class="col-span-1"
                        v-if="card.youtubeCode[activeLang] !== undefined && card.youtubeCode[activeLang].changed"
                        @click="cardYoutube = undefined" />

                    <div class="col-span-3">
                        <label class="label">
                            <span class="label-text">{{ $t('card.instagramCode') }}</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            v-model="cardInstagram"
                            :class="{
                                'input input-bordered w-full': true,
                                'input-accent': card.instagramCode[activeLang] !== undefined && card.instagramCode[activeLang].changed,
                            }" />
                    </div>
                    <UndoField
                        class="col-span-1"
                        v-if="card.instagramCode[activeLang] !== undefined && card.instagramCode[activeLang].changed"
                        @click="cardInstagram = undefined" />
                </template>
            </div>
        </form>
        <div v-else>
            <span class="loading loading-dots loading-md"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardPage',
    props: ['cardId'],
    data() {
        return {
            activeLang: undefined,
            cardsStore: useCardsStore(),
        };
    },
    created() {
        this.cardsStore.fetchCard(this.cardId);
    },
    beforeRouteUpdate(to, _from, next) {
        useCardsStore().fetchCard(to.params.cardId);
        next();
    },
    methods: {
        switchVariant(variant) {
            const variants = this.card.variants.value;

            if (variants.includes(variant)) {
                this.cardsStore.setModification(
                    this.cardId,
                    undefined,
                    'variants',
                    variants.filter((item) => item !== variant),
                );
            } else {
                this.cardsStore.setModification(this.cardId, undefined, 'variants', variants.concat(variant));
            }
        },
        createCard() {
            this.cardsStore.createCard().then((cardId) => {
                this.$router.push({ name: 'RouteCard', params: { ...this.$route.params, cardId: cardId } });
            });
        },
    },
    computed: {
        card() {
            const card = this.cardsStore.card(this.cardId);
            if (card === undefined || !card.fetched) return undefined;
            return card;
        },
        customLot: {
            get() {
                if (this.card.lot === undefined || this.cardsStore.lots.has(this.card.lot.value)) return '';
                return this.card.lot.value;
            },
            set(value) {
                if (value === '') value = undefined;
                this.cardsStore.setModification(this.cardId, undefined, 'lot', value);
            },
        },
        cardLot: {
            get() {
                return this.card.lot.value;
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, undefined, 'lot', value);
            },
        },
        cardNum: {
            get() {
                return this.card.num.value;
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, undefined, 'num', value);
            },
        },
        cardTitle: {
            get() {
                if (this.card.title[this.activeLang] !== undefined) return this.card.title[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'title', value);
            },
        },
        cardBackDescription: {
            get() {
                if (this.card.backDescription[this.activeLang] !== undefined) return this.card.backDescription[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'backDescription', value);
            },
        },
        cardContent: {
            get() {
                if (this.card.cardContent[this.activeLang] !== undefined) return this.card.cardContent[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'cardContent', value);
            },
        },
        cardWiki: {
            get() {
                if (this.card.wikiUrl[this.activeLang] !== undefined) return this.card.wikiUrl[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'wikiUrl', value);
            },
        },
        cardInstagram: {
            get() {
                if (this.card.instagramCode[this.activeLang] !== undefined) return this.card.instagramCode[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'instagramCode', value);
            },
        },
        cardYoutube: {
            get() {
                if (this.card.youtubeCode[this.activeLang] !== undefined) return this.card.youtubeCode[this.activeLang].value;
                return '';
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, this.activeLang, 'youtubeCode', value);
            },
        },
        cardIdValue: {
            get() {
                return this.card.id.value;
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, undefined, 'id', value);
            },
        },
        isFrontOnly: {
            get() {
                return this.card.isFrontOnly.value;
            },
            set(value) {
                this.cardsStore.setModification(this.cardId, undefined, 'isFrontOnly', value);
            },
        },
    },
};
</script>

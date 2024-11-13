<script setup>
import { useCardsStore } from '@/store/cards';
import { useVariantsStore } from '@/store/variants';
import SortByButton from '@/components/SortByButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

const cardsStore = useCardsStore();
const variantsStore = useVariantsStore();

const orderedBy = ref({ field: undefined, direction: 1 });

const cards = computed(() => {
    return cardsStore.cardIds.map((cardId) => {
        const card = cardsStore.card(cardId);
        return {
            _id: cardId,
            nbLangs: card.fetched ? card.langs.size : 0,
            changed: cardsStore.changed(cardId),
            fetched: card.fetched,
            ...card,
        };
    });
});

const orderedCards = computed(() => {
    if (orderedBy.value.field === undefined) return cards.value;
    const field = orderedBy.value.field;

    return [...cards.value].sort((cardA, cardB) => {
        if (cardA[field].value !== undefined) {
            return orderedBy.value.direction > 0 ? cardA[field].value < cardB[field].value : cardB[field].value < cardA[field].value;
        }
        return orderedBy.value.direction > 0 ? cardA[field] < cardB[field] : cardB[field] < cardA[field];
    });
});

const createCard = () => {
    cardsStore.createCard().then((cardId) => {
        router.push({ name: 'RouteCard', params: { cardId: cardId } });
    });
};

onMounted(() => {
    cardsStore.fetchCards();
    variantsStore.fetchVariants();
});
</script>

<template>
    <div class="mx-8">
        <h1 class="text-3xl font-bold">{{ t('cards.label') }}</h1>
        <p>{{ t('cards.description') }}</p>
        <div>
            <div class="btn btn-success btn-xs btn-outline" @click="createCard">{{ t('card.create') }}</div>
        </div>
        <table class="table">
            <!-- head -->
            <thead>
                <tr class="text-center">
                    <th class="max-w-[150px] whitespace-normal">
                        {{ t('common.id') }}<br />
                        <SortByButton field="id" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        {{ t('common.languages') }}<br />
                        <SortByButton field="nbLangs" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        Numéro<br />
                        <SortByButton field="num" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        Lot<br />
                        <SortByButton field="lot" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">Versions<br /></th>
                    <th class="max-w-[120px] whitespace-normal">
                        {{ t('common.changes') }}<br />
                        <SortByButton field="changed" v-model="orderedBy" />
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="cardsStore.loading">
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th></th>
                    <th></th>
                </tr>
                <tr v-else v-for="(card, key) in orderedCards" :key="key">
                    <th>{{ card._id }}</th>
                    <td class="max-w-[100px] whitespace-normal">
                        <div v-if="card.fetched" class="tooltip" :data-tip="t('common.translated', { nb: card.nbLangs })">
                            <progress class="progress w-[100px]" :value="card.nbLangs" :max="cardsStore.langs.length" />
                        </div>
                        <div v-else class="btn btn-ghost btn-circle btn-xs" @click="cardsStore.fetchCard(card._id)">?</div>
                    </td>
                    <td class="text-center">
                        {{ card.num !== undefined && card.num.value ? card.num.value : '' }}
                    </td>
                    <td class="text-center">
                        {{ card.lot !== undefined && card.lot.value ? card.lot.value : '' }}
                    </td>
                    <td v-if="!variantsStore.loading && card.fetched">
                        <div
                            v-for="(variant, key) in card.variants.value"
                            :key="key"
                            class="badge m-1 badge-xs border-none px-[0.5rem] tooltip tooltip-top"
                            :data-tip="variant"
                            :style="{ 'background-color': variantsStore.variant(variant).color.value, 'border-color': 'white' }"></div>
                    </td>
                    <td v-else></td>
                    <td>
                        <span v-if="cardsStore.changed(card._id)">👍</span>
                    </td>
                    <td>
                        <router-link class="link" :to="{ name: 'RouteCard', params: { cardId: card._id, lang: locale } }">{{
                            t('common.edit')
                        }}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useCardsStore } from '@/stores/cards.js';
import ListTitle from '@/components/cards/ListTitle.vue';
import CauseList from '@/components/cards/CauseList.vue';
import ConsequenceList from '@/components/cards/ConsequenceList.vue';

const props = defineProps({
    cardId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const cardStore = useCardsStore();
</script>

<template>
    <list-title
        :nameSingular="$t('card.valid-cause')"
        :namePlural="$t('card.valid-causes')"
        badgeStatus="valid"
        :nbItems="cardStore.linksTo(props.cardId, 'valid', route.params.version).length" />
    <cause-list :causeIds="cardStore.linksTo(props.cardId, 'valid', route.params.version)" />

    <list-title
        :nameSingular="$t('card.valid-consequence')"
        :namePlural="$t('card.valid-consequences')"
        badgeStatus="valid"
        :nbItems="cardStore.linksFrom(props.cardId, 'valid', route.params.version).length" />
    <consequence-list :consequenceIds="cardStore.linksFrom(props.cardId, 'valid', route.params.version)" />

    <list-title
        :nameSingular="$t('card.optional-cause')"
        :namePlural="$t('card.optional-causes')"
        badgeStatus="optional"
        :nbItems="cardStore.linksTo(props.cardId, 'optional', route.params.version).length" />
    <cause-list
        v-if="cardStore.linksTo(props.cardId, 'optional', route.params.version).length > 0"
        :causeIds="cardStore.linksTo(props.cardId, 'optional', route.params.version)" />

    <list-title
        :nameSingular="$t('card.optional-consequence')"
        :namePlural="$t('card.optional-consequences')"
        badgeStatus="optional"
        :nbItems="cardStore.linksFrom(props.cardId, 'optional', route.params.version).length" />
    <consequence-list
        v-if="cardStore.linksFrom(props.cardId, 'optional', route.params.version).length > 0"
        :consequenceIds="cardStore.linksFrom(props.cardId, 'optional', route.params.version)" />

    <list-title
        :nameSingular="$t('card.invalid-cause')"
        :namePlural="$t('card.invalid-causes')"
        badgeStatus="invalid"
        :nbItems="cardStore.linksTo(props.cardId, 'invalid', route.params.version).length" />
    <cause-list
        v-if="cardStore.linksTo(props.cardId, 'invalid', route.params.version).length > 0"
        :causeIds="cardStore.linksTo(props.cardId, 'invalid', route.params.version)" />

    <list-title
        :nameSingular="$t('card.invalid-consequence')"
        :namePlural="$t('card.invalid-consequences')"
        badgeStatus="invalid"
        :nbItems="cardStore.linksFrom(props.cardId, 'invalid', route.params.version).length" />
    <consequence-list
        v-if="cardStore.linksFrom(props.cardId, 'invalid', route.params.version).length > 0"
        :consequenceIds="cardStore.linksFrom(props.cardId, 'invalid', route.params.version)" />
</template>

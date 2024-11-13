<script setup>
import {
    TrashIcon,
    PlusCircleIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloudArrowDownIcon,
    ArrowUturnLeftIcon,
    CameraIcon,
} from '@heroicons/vue/24/solid';

import { useFresksStore } from '@/store/fresks';
import { useCardsStore } from '@/store/cards';
import { useLinksStore } from '@/store/links';
import { useVariantsStore } from '@/store/variants';

import LangSelect from '@/components/LangSelect.vue';
import UndoField from '@/components/UndoField.vue';
import FreskVisjsInterface from '!/src/components/fresk/FreskVisjsInterface.vue';
import { toFreskCoordinates, fromFreskCoordinates, applyEdgeStyle } from '!/src/components/fresk/utils.js';

import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import linksStyle from '!/src/assets/_links/linksStyle.json';

const props = defineProps({
    freskId: {
        type: String,
        required: true,
    },
});

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

const fresksStore = useFresksStore();
const cardsStore = useCardsStore();
const linksStore = useLinksStore();
const variantsStore = useVariantsStore();

const activeLang = ref(undefined);
const selectedNodeId = ref(undefined);
const displayRemovedCards = ref(true);
const importedFreskId = ref(undefined);
const importedNodes = ref(new Set());
const loading = ref(false);
const hideCardsLabels = ref(false);

const visjsComponentRef = ref(null);

const cardSize = 30;

const isNew = computed(() => fresksStore.isNew(props.freskId));
const selectedNode = computed(() => {
    if (selectedNodeId.value === undefined) return undefined;
    return fresksStore.fresk(props.freskId).nodes[selectedNodeId.value].value;
});
const selectedNodeRemoved = computed({
    get() {
        if (selectedNode.value === undefined) return false;
        return selectedNode.value.removed;
    },
    set(value) {
        fresksStore.setModification(props.freskId, selectedNodeId.value, 'nodes', 'removed', value);
    },
});
const selectedNodeXPos = computed({
    get() {
        if (selectedNode.value === undefined) return 0;
        return selectedNode.value.xPos;
    },
    set(value) {
        fresksStore.setModification(props.freskId, selectedNodeId.value, 'nodes', 'xPos', value);
    },
});
const selectedNodeYPos = computed({
    get() {
        if (selectedNode.value === undefined) return 0;
        return selectedNode.value.yPos;
    },
    set(value) {
        fresksStore.setModification(props.freskId, selectedNodeId.value, 'nodes', 'yPos', value);
    },
});
const fresk = computed(() => {
    const fresk = fresksStore.fresk(props.freskId);
    if (!fresk || !fresk.fetched) return undefined;
    return fresk;
});
const freskTitle = computed({
    get() {
        if (fresk.value.title[activeLang.value] !== undefined) return fresk.value.title[activeLang.value].value;
        return '';
    },
    set(value) {
        fresksStore.setModification(props.freskId, activeLang.value, 'title', undefined, value);
    },
});
const freskIdValue = computed({
    get() {
        return fresk.value.id.value;
    },
    set(value) {
        fresksStore.setModification(props.freskId, undefined, 'id', undefined, value);
    },
});
const freskNodeIds = computed(() => new Set(freskNodes.value.map((node) => node.id)));
const selectedVariant = computed(() => {
    if (!fresk.value) return undefined;
    if (fresk.value.variants.value.length === 0) return undefined;
    return fresk.value.variants.value;
});
const freskNodes = computed(() => {
    const nodes = displayRemovedCards.value
        ? Object.keys(fresk.value.nodes)
        : Object.keys(fresk.value.nodes).filter((nodeId) => !fresk.value.nodes[nodeId].value.removed);

    return nodes.map((nodeId) => {
        const node = fresk.value.nodes[nodeId];
        const { x, y } = toFreskCoordinates(node.value.xPos, node.value.yPos);
        return {
            id: nodeId,
            label: hideCardsLabels.value ? '' : node.value.cardId,
            x,
            y,
            size: (node.value.zoom || 1) * cardSize,
            shape: 'image',
            image: cardsStore.cardImage(node.value.cardId, 'fr-FR', selectedVariant.value, 'front'),
            opacity: node.value.removed ? 0.3 : 1,
        };
    });
});
const freskEdges = computed(() => {
    if (linksStore.loading.value) return [];
    return linksStore.edges.concat(Object.values(fresk.value.edges).map((edgeValue) => edgeValue.value)).map((link) => {
        const linkClasses = [link.status];
        const cls = link.class;

        if (cls != undefined) {
            if (typeof cls == 'string') {
                linkClasses.push(cls);
            } else {
                linkClasses.push(...cls);
            }
        }
        return applyEdgeStyle(
            link,
            linkClasses.map((cls) => linksStyle[cls]).filter((x) => x != undefined),
        );
    });
});
const freskBackground = computed(() => fresk.value.background.value);
const customLot = computed({
    get() {
        if (fresk.value.lot === undefined || cardsStore.lots.has(fresk.value.lot.value)) return '';
        return fresk.value.lot.value;
    },
    set(value) {
        if (value === '') value = undefined;
        fresksStore.setModification(props.freskId, undefined, 'lot', undefined, value);
    },
});
const freskLot = computed({
    get() {
        return fresk.value.lot.value;
    },
    set(value) {
        fresksStore.setModification(props.freskId, undefined, 'lot', undefined, value);
    },
});
const importedFresk = computed({
    get() {
        return importedFreskId.value;
    },
    set(value) {
        fresksStore.fetchFresk(value).then(() => {
            importedNodes.value = new Set(Object.keys(fresksStore.fresk(value).nodes));
        });
        importedFreskId.value = value;
    },
});
const freskRemoved = computed({
    get() {
        if (fresk.value.removed === undefined) return false;
        return fresk.value.removed.value;
    },
    set(value) {
        fresksStore.setModification(props.freskId, undefined, 'removed', undefined, value);
    },
});

onMounted(() => {
    fresksStore.fetchFresk(props.freskId);
    cardsStore.fetchCards();
    linksStore.prefetchAllLinks();
    variantsStore.fetchVariants();
    fresksStore.fetchFresks();
});

watch(
    () => route.params.freskId,
    (newVal) => {
        fresksStore.fetchFresk(newVal);
    },
);

const removeTemporaryFresk = () => {
    loading.value = true;
    fresksStore.setModification(props.freskId, undefined, undefined, undefined, undefined);
    router.push({ name: 'RouteFresks', params: { ...route.params } });
};

const createFresk = () => {
    fresksStore.createFresk().then((freskId) => {
        router.push({ name: 'RouteFresk', params: { freskId: freskId } });
    });
};

const onNodeSelection = (cardId) => {
    selectedNodeId.value = cardId;
};

const onUnselect = () => {
    selectedNodeId.value = undefined;
};

const onNodeDragEnd = ({ nodeId, pos }) => {
    const { x, y } = fromFreskCoordinates(pos.x, pos.y);
    fresksStore.setModification(props.freskId, nodeId, 'nodes', 'xPos', x);
    fresksStore.setModification(props.freskId, nodeId, 'nodes', 'yPos', y);
};

const addCard = (cardId) => {
    fresksStore.setModification(props.freskId, cardId, 'nodes', undefined, { cardId: cardId, xPos: 0, yPos: 0 });
    selectedNodeId.value = cardId;
};

const switchVariant = (variant) => {
    const variants = fresk.value.variants.value;

    if (variants.includes(variant)) {
        fresksStore.setModification(
            props.freskId,
            undefined,
            'variants',
            undefined,
            variants.filter((item) => item !== variant),
        );
    } else {
        fresksStore.setModification(props.freskId, undefined, 'variants', undefined, variants.concat(variant));
    }
};

const switchImportNode = (nodeId) => {
    if (importedNodes.value.has(nodeId)) importedNodes.value.delete(nodeId);
    else importedNodes.value.add(nodeId);
};

const importCards = () => {
    if (!importedFreskId.value) return;
    const importedFresk = fresksStore.fresk(importedFreskId.value);

    for (const importedNodeId of importedNodes.value) {
        fresksStore.setModification(props.freskId, importedNodeId, 'nodes', undefined, importedFresk.nodes[importedNodeId].value);
    }
};

const exportFresk = () => {
    hideCardsLabels.value = true;
    visjsComponentRef.value.exportImage(props.freskId + '.png');
    setTimeout(() => {
        hideCardsLabels.value = false;
    }, 9000); // because export image take 8000
};
</script>

<template>
    <div class="container mx-auto">
        <form v-if="fresk !== undefined && !fresksStore.loading && !loading" class="px-10">
            <div class="flex justify-between">
                <router-link
                    :to="{ name: 'RouteFresk', params: { lang: locale, freskId: fresksStore.previousFreskId(props.freskId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    <ChevronLeftIcon class="w-4 h-4" />{{ t('fresk.previous') }}
                </router-link>

                <button class="btn btn-ghost text-xs" @click="createFresk">{{ t('fresk.create') }}</button>

                <router-link
                    :to="{ name: 'RouteFresk', params: { lang: locale, freskId: fresksStore.nextFreskId(props.freskId) } }"
                    class="btn btn-ghost normal-case text-xs">
                    {{ t('fresk.next') }}<ChevronRightIcon class="w-4 h-4" />
                </router-link>
            </div>

            <h1 class="text-3xl font-semibold text-gray-900">{{ t('fresk.label', { freskId: fresk.id.value }) }}</h1>
            <template v-if="!isNew">
                <div>
                    <label class="label">
                        <span class="label-text" v-if="!freskRemoved">{{ t('fresk.remove') }}</span>
                        <span class="label-text" v-else>{{ t('common.undo') }}</span>
                    </label>
                    <input type="checkbox" class="toggle toggle-error" v-model="freskRemoved" />
                </div>
                <div v-if="freskRemoved">
                    <p class="text-center">{{ t('fresk.removed-warning') }}</p>
                </div>
            </template>
            <template v-else>
                <div class="btn btn-error btn-xs btn-outline" @click="removeTemporaryFresk">
                    <ArrowUturnLeftIcon class="w-4 h-4" />
                    {{ t('fresk.undo-create') }}
                </div>
            </template>

            <div v-if="!freskRemoved" class="form-control w-full grid grid-cols-4 gap-x-6 gap-y-8 md:grid-cols-8">
                <div class="col-span-3">
                    <label class="label">
                        <span class="label-text">{{ t('common.langToEdit') }}</span>
                    </label>
                    <LangSelect :langs="fresk.langs" :availableLangs="cardsStore.langs" v-model="activeLang" />
                </div>

                <div class="col-span-3 col-start-1">
                    <label class="label">
                        <span class="label-text">Identifiant de la Fresque (⚠️ ne peut pas commencer par un _)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        :class="{
                            'input input-bordered w-full': true,
                        }"
                        v-model="freskIdValue" />
                </div>
                <UndoField class="col-span-1" v-if="fresk.id !== undefined && fresk.id.changed" @click="freskIdValue = undefined" />

                <div class="md:col-span-7 col-span-3 col-start-1">
                    <label class="label">
                        <span class="label-text">{{ t('fresk.title') }}</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Type here"
                        :class="{
                            'input input-bordered w-full': true,
                            'input-accent': fresk.title[activeLang] !== undefined && fresk.title[activeLang].changed,
                        }"
                        v-model="freskTitle" />
                </div>
                <UndoField
                    class="col-span-1"
                    v-if="fresk.title[activeLang] !== undefined && fresk.title[activeLang].changed"
                    @click="freskTitle = undefined" />

                <div class="col-start-1 col-span-3">
                    <label class="label">
                        <span class="label-text">{{ t('fresk.variants') }}</span>
                    </label>
                    <div
                        v-for="(variant, key) in variantsStore.variantIds"
                        :key="key"
                        :class="{ 'mx-1 badge badge-lg cursor-pointer': true, 'badge-success': fresk.variants.value.includes(variant) }"
                        @click="switchVariant(variant)">
                        <span class="label-text">{{ variant }}</span>
                    </div>
                </div>
                <UndoField
                    v-if="fresk.variants.changed"
                    class="col-span-1"
                    @click="fresksStore.setModification(props.freskId, undefined, 'variants', undefined)" />

                <div class="col-span-3 col-start-1 md:col-start-5 tooltip tooltip-right">
                    <label class="label">
                        <span class="label-text">{{ t('card.lotNumber') }}</span>
                    </label>
                    <div class="join w-full">
                        <select :disabled="customLot !== ''" class="join-item select select-bordered w-full" v-model="freskLot">
                            <option v-for="(lot, key) in cardsStore.lots" :key="key">{{ lot }}</option>
                        </select>
                        <input class="join-item input input-bordered w-20" type="text" :placeholder="t('common.new')" v-model="freskLot" />
                    </div>
                </div>
                <UndoField v-if="fresk.lot.changed" class="col-span-1" @click="freskLot = undefined" />

                <div class="divider w-full col-span-2 md:col-start-3 col-start-2 md:col-span-4"></div>
                <div class="col-span-4 md:col-span-6 col-start-1">
                    <label class="label">
                        <span class="label-text">{{ t('fresk.layout') }}</span>
                    </label>
                    <FreskVisjsInterface
                        class="h-[400px]"
                        id="network"
                        ref="visjsComponentRef"
                        :nodes="freskNodes"
                        :edges="freskEdges"
                        :background="freskBackground"
                        @node-selection="onNodeSelection"
                        @node-deselection="onUnselect"
                        @node-dragend="onNodeDragEnd" />
                </div>
                <div class="col-span-4 col-start-1 md:col-start-7 md:col-span-2">
                    <button tabindex="0" class="btn join-item w-full max-w-[300px] btn-xs mb-2" onclick="import_modal.showModal()">
                        <CloudArrowDownIcon class="w-4 h-4" />
                        {{ t('fresk.importotherfresk') }}
                    </button>
                    <div class="dropdown join-item w-full max-w-[300px]">
                        <label tabindex="0" class="btn join-item w-full max-w-[300px] btn-xs">
                            <PlusIcon class="w-4 h-4" />
                            {{ t('fresk.addcard') }}
                        </label>
                        <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] w-full bg-base-100 rounded-box overflow-scroll">
                            <li v-for="(cardId, key) in cardsStore.cardIds.filter((cardId) => !freskNodeIds.has(cardId))" :key="key">
                                <span @click="addCard(cardId)">{{ t('card.label', { cardId: cardId }) }}</span>
                            </li>
                        </ul>
                    </div>
                    <label class="label">
                        <span class="label-text">{{ t('fresk.hide') }}</span>
                    </label>
                    <input type="checkbox" class="toggle" checked v-model="displayRemovedCards" />

                    <div class="divider w-full"></div>

                    <template v-if="selectedNodeId != undefined">
                        <h3>{{ t('card.label', { cardId: selectedNode.cardId }) }}</h3>

                        <button v-if="!selectedNode.removed" class="btn btn-xs btn-error" @click="selectedNodeRemoved = true">
                            <TrashIcon class="w-4 h-4" />
                            {{ t('fresk.remove') }}
                        </button>
                        <button v-else class="btn btn-xs btn-success btn-outline" @click="selectedNodeRemoved = false">
                            <PlusCircleIcon class="w-4 h-4" />
                            {{ t('fresk.restore') }}
                        </button>

                        <label class="label">
                            <span class="label-text">{{ t('fresk.xposition') }}</span>
                        </label>
                        <input type="number" v-model="selectedNodeXPos" :class="{ 'input input-bordered w-full': true }" />

                        <label class="label">
                            <span class="label-text">{{ t('fresk.yposition') }}</span>
                        </label>
                        <input type="number" v-model="selectedNodeYPos" :class="{ 'input input-bordered w-full': true }" />

                        <UndoField
                            class="w-full"
                            v-if="fresk.nodes[selectedNodeId].changed"
                            @click="
                                fresksStore.setModification(props.freskId, selectedNodeId, 'nodes', undefined, undefined);
                                selectedNodeId = undefined;
                            " />
                    </template>
                    <p v-else class="italic text-center">{{ $t('fresk.start') }}</p>

                    <div class="tooltip tooltip-left mr-2" :data-tip="$t('fresk.export')">
                        <button tabindex=" 0" class="btn btn-xs mb-2" @click="exportFresk">
                            <CameraIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            <dialog id="import_modal" class="modal">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

                        <template v-if="!fresksStore.loading">
                            <label class="label">
                                <span class="label-text">{{ t('fresk.import.fresk') }}</span>
                            </label>
                            <select class="select select-bordered w-full" v-model="importedFresk">
                                <option v-for="(freskId, index) in fresksStore.freskIds" :value="freskId" :key="index">
                                    {{ freskId }}
                                </option>
                            </select>
                            <label class="label">
                                <span class="label-text">{{ t('fresk.import.cards') }}</span>
                            </label>
                            <div v-if="importedFresk && fresksStore.fresk(importedFresk).nodes !== undefined" class="grid grid-cols-2 gap-x-6">
                                <div
                                    v-for="(cardId, index) in Object.keys(fresksStore.fresk(importedFresk).nodes)"
                                    :key="index"
                                    class="form-control col-span-1">
                                    <label class="label cursor-pointer">
                                        <span class="label-text">{{ t('card.label', { cardId: cardId }) }}</span>
                                        <input
                                            type="checkbox"
                                            :checked="importedNodes.has(cardId)"
                                            class="checkbox"
                                            @click="switchImportNode(cardId)" />
                                    </label>
                                </div>
                            </div>
                            <template v-else-if="importedFresk">
                                <span class="loading loading-dots loading-md"></span>
                            </template>
                        </template>
                        <template v-else>
                            <span class="loading loading-dots loading-md"></span>
                        </template>
                        <button class="btn w-full btn-success btn-outline" @click="importCards">
                            {{ t('fresk.import.button') }}
                        </button>
                    </form>
                </div>
            </dialog>
        </form>
        <div v-else>
            <span class="loading loading-dots loading-md"></span>
        </div>
    </div>
</template>

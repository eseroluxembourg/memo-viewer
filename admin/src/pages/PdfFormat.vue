<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePdfFormatsStore } from '@/store/pdfformats';
import { CloudArrowUpIcon } from '@heroicons/vue/24/solid';
import UndoField from '@/components/UndoField.vue';
import PDFObject from 'pdfobject';

const props = defineProps(['pdfFormatId']);
const pdfFormatsStore = usePdfFormatsStore();

const pdfUrl = ref(undefined);
const currentIndex = ref(0);

const pdfFormat = computed(() => {
    const pdfFormat = pdfFormatsStore.pdfFormat(props.pdfFormatId);
    if (pdfFormat === undefined) return undefined;
    return pdfFormat;
});

const currentElement = computed(() => {
    if (!pdfUrl.value) return undefined;
    if (pdfUrl.value) PDFObject.embed(pdfUrl.value, '#pdfpreview', { height: '350px', page: pdfFormat.value[currentIndex.value].pdfpage.value });
    return pdfFormat.value[currentIndex.value];
});

const cardId = computed({
    get() {
        return currentElement.value.cardid.value;
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'cardid', value);
    },
});

const pdfPage = computed({
    get() {
        return currentElement.value.pdfpage.value;
    },
    set(value) {
        if (pdfUrl.value) PDFObject.embed(pdfUrl.value, '#pdfpreview', { height: '350px', page: value });
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'pdfpage', value);
    },
});

const isFront = computed({
    get() {
        return currentElement.value.side.value === 'front';
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'side', value ? 'front' : 'back');
    },
});

const pdfRotation = computed(() => {
    if (currentElement.value === undefined) return 'rotate-0';
    if (orientation.value === 'south') return 'rotate-180';
    else if (orientation.value === 'east') return 'rotate-90';
    else if (orientation.value === 'west') return '-rotate-90';
    else return 'rotate-0';
});

const orientation = computed({
    get() {
        if (currentElement.value.options === undefined) return 'north';
        return currentElement.value.options.value.orientation;
    },
    set(orientation) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', {
            ...currentElement.value.options.value,
            orientation,
        });
    },
});

const cropX = computed({
    get() {
        if (currentElement.value.options === undefined) return undefined;
        if (currentElement.value.options.value.crop === undefined) return undefined;
        return currentElement.value.options.value.crop.x;
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', {
            ...currentElement.value.options.value,
            crop: { ...currentElement.value.options.value.crop, x: value },
        });
    },
});

const cropY = computed({
    get() {
        if (currentElement.value.options === undefined) return undefined;
        if (currentElement.value.options.value.crop === undefined) return undefined;
        return currentElement.value.options.value.crop.y;
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', {
            ...currentElement.value.options.value,
            crop: { ...currentElement.value.options.value.crop, y: value },
        });
    },
});

const cropWidth = computed({
    get() {
        if (currentElement.value.options === undefined) return undefined;
        if (currentElement.value.options.value.crop === undefined) return undefined;
        return currentElement.value.options.value.crop.width;
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', {
            ...currentElement.value.options.value,
            crop: { ...currentElement.value.options.value.crop, width: value },
        });
    },
});

const cropHeight = computed({
    get() {
        if (currentElement.value.options === undefined) return undefined;
        if (currentElement.value.options.value.crop === undefined) return undefined;
        return currentElement.value.options.value.crop.height;
    },
    set(value) {
        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', {
            ...currentElement.value.options.value,
            crop: { ...currentElement.value.options.value.crop, height: value },
        });
    },
});

const options = computed({
    get() {
        return JSON.stringify(currentElement.value.options.value);
    },
    set(value) {
        const orientation = JSON.parse(value).orientation;
        if (orientation === 'south') pdfRotation.value = 'rotate-180';
        else if (orientation === 'east') pdfRotation.value = 'rotate-90';
        else if (orientation == 'west') pdfRotation.value = '-rotate-90';
        else pdfRotation.value = 'north';

        pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value, 'options', JSON.parse(value));
    },
});

function pdfUploaded(event) {
    const file = event.target.files[0];
    pdfUrl.value = URL.createObjectURL(file);
    PDFObject.embed(pdfUrl.value, '#pdfpreview', { height: '350px' });
}

function addCard() {
    if (currentElement.value === undefined) {
        pdfFormatsStore.setModification(props.pdfFormatId, 0, undefined, {
            pdfpage: 1,
            cardid: '1',
            side: 'front',
            options: {},
        });
        currentIndex.value = 0;
        return;
    }

    pdfFormatsStore.setModification(props.pdfFormatId, currentIndex.value + 1, undefined, {
        pdfpage: currentElement.value.pdfpage.value + 1,
        cardid: currentElement.value.cardid.value,
        side: currentElement.value.side.value === 'front' ? 'back' : 'front',
        options: {},
    });
    ++currentIndex.value;
}

onMounted(() => {
    pdfFormatsStore.fetchPdfFormat(props.pdfFormatId);
});
</script>

<template>
    <div v-if="!pdfFormatsStore.loading && !pdfFormatsStore.loadinsPdfFormat" class="container mx-auto max-w-4xl p-10">
        <h1 class="text-3xl">Pdf Format</h1>
        <p class="my-3">
            Cette page est en cours de développement, pas du tout finalisée. C'est un prototype qui a servi pour la création du pdfformat de la
            Fresque Océane.
        </p>
        <div class="grid grid-cols-2">
            <div class="col-span-1 mx-2">
                <div :class="{ 'btn w-full': true, 'btn-disabled': currentIndex == 0 }" @click="--currentIndex">Previous</div>
                <div v-if="currentElement !== undefined" class="grid grid-cols-3">
                    <!-- Page -->
                    <div class="col-span-2 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Page du pdf</span>
                        </label>
                        <input class="input input-bordered w-full" type="number" v-model="pdfPage" />
                    </div>
                    <UndoField class="col-span-1" />

                    <div class="col-span-2 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Identifiant de la carte</span>
                        </label>
                        <input class="input input-bordered w-full" type="text" v-model="cardId" />
                    </div>
                    <div class="col-span-2 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Recto ? </span>
                            <input type="checkbox" checked="checked" className="checkbox" v-model="isFront" />
                        </label>
                    </div>
                    <UndoField class="col-span-1" />

                    <div class="col-span-2 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Utiliser une orientation déjà présente</span>
                        </label>
                        <select class="select w-full select-bordered" v-model="options">
                            <option v-for="opt in pdfFormatsStore.listOptions(props.pdfFormatId)" :key="opt">{{ opt }}</option>
                        </select>
                    </div>

                    <div class="col-span-2 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Orientation de la carte</span>
                        </label>
                        <select class="select w-full select-bordered" v-model="orientation">
                            <option key="north">north</option>
                            <option key="south">south</option>
                            <option key="east">east</option>
                            <option key="west">west</option>
                        </select>
                    </div>
                    <div class="col-start-1 col-span-1 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">X</span>
                        </label>
                        <input class="input input-bordered w-full" type="number" v-model="cropX" />
                    </div>
                    <div class="col-start-3 col-span-1 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Y</span>
                        </label>
                        <input class="input input-bordered w-full" type="number" v-model="cropY" />
                    </div>
                    <div class="col-start-1 col-span-1 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Largeur</span>
                        </label>
                        <input class="input input-bordered w-full" type="number" v-model="cropWidth" />
                    </div>
                    <div class="col-start-3 col-span-1 tooltip tooltip-right">
                        <label class="label">
                            <span class="label-text">Hauteur</span>
                        </label>
                        <input class="input input-bordered w-full" type="number" v-model="cropHeight" />
                    </div>

                    <!-- CardId -->
                    <!-- Side -->
                    <!-- Options Todo -->
                </div>
                <div v-if="currentIndex < Object.keys(pdfFormat.value).length - 1" class="btn w-full" @click="++currentIndex">Next</div>
                <div v-else class="btn w-full" @click="addCard">Nouveau</div>
            </div>
            <div class="col-span-1 mx-2">
                <div class="w-full tooltip tooltip-right" data-tip="Charger un pdf pour prévisualiser">
                    <div class="btn w-full">
                        <CloudArrowUpIcon class="w-4 h-4" />
                        Charger un pdf
                        <input type="file" accept=".pdf" class="hidden-file-input" @input="pdfUploaded" />
                    </div>
                </div>
                <div :class="pdfRotation" id="pdfpreview"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hidden-file-input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    opacity: 0;
    outline: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
}
</style>

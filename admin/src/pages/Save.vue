<script setup>
import ModificationReview from '@/components/ModificationReview.vue';
import { CloudArrowDownIcon, CloudArrowUpIcon } from '@heroicons/vue/24/solid';
import { useCardsStore } from '@/store/cards';
import { useLinksStore } from '@/store/links';
import { useFresksStore } from '@/store/fresks';
import { useGitlabStore } from '@/store/gitlab';
import { useSettingsStore } from '@/store/settings';
import { useVariantsStore } from '@/store/variants';
import { usePdfFormatsStore } from '@/store/pdfformats';

const cardsStore = useCardsStore();
const linksStore = useLinksStore();
const fresksStore = useFresksStore();
const settingsStore = useSettingsStore();
const variantsStore = useVariantsStore();
const pdfFormatsStore = usePdfFormatsStore();

cardsStore.fetchAllModifiedCards();
linksStore.fetchAllModifiedLinks();
fresksStore.fetchAllModifiedFresks();
variantsStore.fetchVariants();
pdfFormatsStore.fetchPdfFormats();
</script>

<template>
    <div class="container mx-1 p-10 max-w-4xl">
        <h1 class="text-3xl font-semibold text-gray-900 mb-2">Publier vos modifications</h1>
        <p>
            Voici toutes les modifications effectuées lors de cette session. Si vous êtes satisfait·e·s de toutes ces modifications, cliquer sur le
            bouton <b>Publier</b> en bas de la page.
        </p>

        <!-- TODO: edit button is broken -->
        <!-- TODO: lang label is wrong -->
        <ModificationReview :label="$t('cards.label')" :store="cardsStore" subfieldLabel="Langue" routeEditName="RouteCard" routeParam="cardId" />

        <ModificationReview :label="$t('links.label')" :store="linksStore" subfieldLabel="Langue" routeEditName="RouteLink" routeParam="linkId" />

        <ModificationReview
            :label="$t('fresks.label')"
            :store="fresksStore"
            subfieldLabel="Élement modifié"
            routeEditName="RouteFresk"
            routeParam="freskId" />

        <ModificationReview
            :label="$t('variants.label')"
            :store="variantsStore"
            subfieldLabel="Élement modifié"
            routeEditName="RouteVariant"
            routeParam="variantId" />

        <ModificationReview
            :label="'PdfFormats'"
            :store="pdfFormatsStore"
            subfieldLabel="Élement modifié"
            routeEditName="RoutePdfFormat"
            routeParam="pdfFormatId" />

        <p class="mb-5">Écris ici une courte explication de ta modification, tu peux te référer à des Issues Gitlab en écrivant <i>#23</i>.</p>
        <p class="mb-5">
            Si tu le souhaites, ou si tu ne disposes pas d'un jeton d'authentification, tu peux aussi télécharger une sauvegarde des modifications et
            l'envoyer par email aux référent·e·s de la Fresque : <a :href="`mailto:${settingsStore.contact}`">{{ settingsStore.contact }}</a>
        </p>
        <div class="join w-full">
            <input
                type="text"
                placeholder="cartes: modifications..."
                :class="{ 'join-item input input-bordered w-full': true, 'btn-disabled': commiting }"
                v-model="commitMessage" />
            <button :class="{ 'join-item btn btn-success btn-outline': true, 'btn-disabled': !commitAllowed }" @click="createAndPostCommit">
                <span v-if="commiting" class="loading loading-dots loading-lg"></span>
                Publier
            </button>
            <div class="tooltip tooltip-left" data-tip="Télécharger une sauvegarde des modifications">
                <button class="join-item btn" @click="downloadAllModifications">
                    <CloudArrowDownIcon class="w-4 h-4" />
                </button>
            </div>
            <div class="tooltip tooltip-left" data-tip="Charger une sauvegarde de modifications">
                <div class="join-item btn">
                    <CloudArrowUpIcon class="w-4 h-4" />
                    <input type="file" accept=".json" class="hidden-file-input" @input="modificationsUploaded" />
                </div>
            </div>
        </div>
        <div v-if="errorMessage !== ''" class="alert alert-error text-sm my-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage !== ''" class="alert alert-success text-sm my-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SavePage',
    data() {
        return {
            commitMessage: '',
            commiting: false,
            errorMessage: '',
            successMessage: '',
        };
    },
    computed: {
        commitAllowed() {
            return (
                this.commitMessage !== '' &&
                !this.commiting &&
                !useCardsStore().loading &&
                !useLinksStore().loading &&
                !useVariantsStore().loading &&
                (useCardsStore().hasModifications ||
                    useLinksStore().hasModifications ||
                    useFresksStore().hasModifications ||
                    useVariantsStore().hasModifications ||
                    usePdfFormatsStore().hasModifications)
            );
        },
    },
    methods: {
        downloadAllModifications() {
            const linksStore = useLinksStore();
            const cardsStore = useCardsStore();
            const fresksStore = useFresksStore();
            const settingsStore = useSettingsStore();
            const variantsStore = useVariantsStore();
            const pdfFormatsStore = usePdfFormatsStore();

            const dump = {
                version: settingsStore.version,
                host: settingsStore.host,
                modifications: {
                    cards: cardsStore.flatModifications,
                    links: linksStore.flatModifications,
                    fresks: fresksStore.flatModifications,
                    variants: variantsStore.flatModifications,
                    pdfFormats: pdfFormatsStore.flatModifications,
                },
            };

            const str = JSON.stringify(dump, null, 4);
            const bytes = new TextEncoder().encode(str);
            const blob = new Blob([bytes], {
                type: 'application/json;charset=utf-8',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.download = 'memocms_modifications.json';
            link.href = url;
            document.body.appendChild(link);
            link.click();

            // // cleanup temporary elements
            document.body.removeChild(link);
        },
        createAndPostCommit() {
            this.commiting = true;
            this.errorMessage = '';
            const linksStore = useLinksStore();
            const cardsStore = useCardsStore();
            const fresksStore = useFresksStore();
            const pdfFormatStore = usePdfFormatsStore();
            // const variantsStore = useVariantsStore();

            const linksValidity = linksStore.checkValidityForAll();
            const cardsValidity = cardsStore.checkValidityForAll();
            if (!linksValidity.valid || !cardsValidity.valid) {
                this.commiting = false;
                this.errorMessage = `Les données ne sont pas valides. Erreurs: ${linksValidity.messages.join(' ; ')} ; ${cardsValidity.messages.join(
                    ' ; ',
                )} `;
                return;
            }

            const cardModifiedFiles = cardsStore.allModifiedFiles;
            const linkModifiedFiles = linksStore.allModifiedFiles;
            const freskModifiedFiles = fresksStore.allModifiedFiles;
            const pdfFormatModifiedFiles = pdfFormatStore.allModifiedFiles;
            // TODO
            // const variantsModifiedFiles = []; //variantsStore.allModifiedFiles;

            useGitlabStore()
                .createAndPostCommit(
                    this.commitMessage,
                    cardModifiedFiles.concat(linkModifiedFiles).concat(freskModifiedFiles).concat(pdfFormatModifiedFiles),
                )
                .then(() => {
                    useGitlabStore()
                        .pull()
                        .then(() => {
                            this.commiting = false;
                            cardsStore.clearModifications();
                            cardsStore.resetCards();
                            linksStore.clearModifications();
                            linksStore.resetLinks();
                            fresksStore.clearModifications();
                            fresksStore.resetFresks();
                            pdfFormatStore.clearModifications();
                            // TODO create me
                            // pdfFormatStore.resetPdfFormats();
                            this.commitMessage = '';
                            this.successMessage =
                                "Félicitations, vos modifications ont bien été sauvegardées. Elles devraient être visibles d'ici quelques minutes.";
                        });
                })
                .catch((error) => {
                    this.commiting = false;
                    console.warn(error);
                    this.errorMessage = `Une erreur est survenue pendant le commit: ${error.toString()}`;
                });
        },
        modificationsUploaded(event) {
            const file = event.target.files[0];

            file.text().then((txt) => {
                // TODO check the structure of the file
                const modifications = JSON.parse(txt).modifications;

                const linksStore = useLinksStore();
                const cardsStore = useCardsStore();
                const fresksStore = useFresksStore();
                const variantsStore = useVariantsStore();
                const pdfFormatsStore = usePdfFormatsStore();

                modifications.cards.map(({ id, subfield, field, newValue }) => {
                    cardsStore.fetchCard(id).then(() => cardsStore.setModification(id, subfield, field, newValue));
                });

                modifications.links.map(({ id, subfield, field, newValue }) => {
                    linksStore.fetchLink(id).then(() => {
                        linksStore.setModification(id, subfield, field, newValue);
                    });
                });

                modifications.fresks.map(({ id, subfield, field, newValue }) => {
                    fresksStore.fetchFresk(id).then(() => {
                        fresksStore.setModification(id, subfield, field, undefined, newValue);
                    });
                });

                modifications.pdfFormats.map(({ id, subfield, field, newValue }) => {
                    pdfFormatsStore.fetchPdfFormat(id).then(() => {
                        pdfFormatsStore.setModification(id, field, subfield, newValue);
                    });
                });

                modifications.variants.map(({ id, subfield, field, newValue }) => {
                    variantsStore.fetchVariants().then(() => {
                        variantsStore.setModification(id, subfield, field, undefined, newValue);
                    });
                });
            });
        },
    },
};
</script>

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

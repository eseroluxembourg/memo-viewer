<script setup>
import { PencilIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';
import DiffReview from '@/components/DiffReview.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    label: String,
    store: Object,
    subfieldLabel: String,
    routeEditName: String,
    routeParam: String,
});

const { locale } = useI18n();
</script>

<template>
    <template v-if="props.store.flatModifications.length > 0">
        <h2 class="text-base font-semibold text-gray-700 mt-5">{{ props.label }}</h2>
        <div class="py-1">
            <div class="btn btn-xs btn-error btn-outline" @click="props.store.clearModifications()">Annuler</div>
        </div>
        <table class="table table-xs">
            <thead>
                <tr>
                    <th>Identifiant</th>
                    <th>Champ Modifié</th>
                    <th>{{ props.subfieldLabel }}</th>
                    <th>Ancienne valeur</th>
                    <th>Nouvelle valeur</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(modification, key) in props.store.flatModifications" :key="key">
                    <th>{{ modification['id'] }}</th>
                    <td>{{ modification['field'] }}</td>
                    <td>{{ modification['subfield'] || '-' }}</td>
                    <td>
                        <diff-review :oldValue="modification['oldValue']" :newValue="modification['newValue']" mode="old" />
                    </td>
                    <td>
                        <diff-review :oldValue="modification['oldValue']" :newValue="modification['newValue']" mode="new" />
                    </td>
                    <td>
                        <div class="tooltip tooltip-left mr-2" data-tip="Modifier l'élément">
                            <router-link
                                tag="button"
                                class="btn btn-circle"
                                :to="{ name: props.routeEditName, params: { [props.routeParam]: modification['id'], lang: locale } }">
                                <PencilIcon class="w-4 h-4" />
                            </router-link>
                        </div>
                        <div
                            v-if="modification['field'] !== 'id' && !props.store.isNew(modification['id'])"
                            class="tooltip tooltip-left"
                            data-tip="Annuler">
                            <button
                                class="btn btn-circle"
                                @click="props.store.setModification(modification['id'], modification['subfield'], modification['field'], undefined)">
                                <ArrowUturnLeftIcon class="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="divider" />
    </template>
</template>

<script setup>
import SortByButton from '@/components/SortByButton.vue';
import { useLinksStore } from '@/store/links';
import { useCardsStore } from '@/store/cards';
const linksStore = useLinksStore();
const cardsStore = useCardsStore();
linksStore.fetchLinks();
cardsStore.fetchCards();
</script>

<template>
    <div>
        <h1 class="text-3xl font-bold">{{ $t('links.label') }}</h1>
        <p>{{ $t('links.description') }}</p>
        <div>
            <div class="btn btn-success btn-xs btn-outline" @click="createLink">{{ $t('link.create') }}</div>
        </div>
        <table class="table">
            <!-- head -->
            <thead class="text-center">
                <tr>
                    <th class="max-w-[100px] whitespace-normal">
                        {{ $t('common.id') }}
                        <SortByButton field="id" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[80px] whitespace-normal">
                        {{ $t('common.from') }}
                        <SortByButton field="fromCardId" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[80px] whitespace-normal">
                        {{ $t('common.to') }}
                        <SortByButton field="toCardId" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[100px] whitespace-normal">
                        {{ $t('common.languages') }}
                        <SortByButton field="nbLangs" v-model="orderedBy" />
                    </th>
                    <th class="max-w-[120px] whitespace-normal">
                        {{ $t('common.changes') }}
                        <SortByButton field="changed" v-model="orderedBy" />
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="linksStore.loading">
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th><span class="loading loading-dots loading-md"></span></th>
                    <th></th>
                </tr>
                <tr v-else v-for="(link, key) in orderedLinks" :key="key">
                    <th>{{ link.id }}</th>
                    <td>
                        {{ link.fromCardId }}
                    </td>
                    <td>
                        {{ link.toCardId }}
                    </td>
                    <td>
                        <div v-if="link.fetched" class="tooltip" :data-tip="$t('common.translated', { nb: link.nbLangs })">
                            <progress class="progress w-[100px]" p :value="link.nbLangs" :max="cardsStore.langs.length" />
                        </div>
                        <div v-else class="btn btn-ghost btn-circle btn-xs" @click="linksStore.fetchLink(link['id'])">?</div>
                    </td>
                    <td>
                        <div v-if="link.removed" class="tooltip tooltip-top" :data-tip="$t('link.removed')">❌</div>
                        <div v-else-if="link.new" class="tooltip tooltip-top" :data-tip="$t('link.added')">➕</div>
                        <div v-else-if="link.changed" class="tooltip tooltip-top" :data-tip="$t('link.changed')">👍</div>
                    </td>
                    <td>
                        <router-link class="link" :to="{ name: 'RouteLink', params: { linkId: link.id } }">
                            {{ $t('common.edit') }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'LinksPage',
    data() {
        return {
            orderedBy: { field: undefined, direction: 1 },
        };
    },
    methods: {
        createLink() {
            const linksStore = useLinksStore();
            linksStore.createLink().then((linkId) => {
                this.$router.push({ name: 'RouteLink', params: { linkId: linkId } });
            });
        },
    },
    computed: {
        links() {
            const linksStore = useLinksStore();
            return linksStore.linkIds.map((linkId) => {
                const link = linksStore.link(linkId);
                return {
                    id: linkId,
                    fromCardId: link.fromCardId !== undefined && link.fromCardId.value,
                    toCardId: link.toCardId !== undefined && link.toCardId.value,
                    nbLangs: link.langs.size,
                    changed: linksStore.changed(linkId),
                    new: linksStore.isNew(linkId),
                    removed: link.removed !== undefined && link.removed.value,
                    fetched: link.fetched,
                };
            });
        },
        orderedLinks() {
            if (this.orderedBy.field === undefined) return this.links;
            const field = this.orderedBy.field;

            return this.links.sort((linkA, linkB) => {
                return this.orderedBy.direction > 0 ? linkA[field] < linkB[field] : linkB[field] < linkA[field];
            });
        },
    },
};
</script>

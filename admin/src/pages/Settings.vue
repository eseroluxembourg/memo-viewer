<script setup></script>

<template>
    <div class="container mx-1 p-10 max-w-4xl">
        <h1 class="text-3xl font-semibold text-gray-900 pb-4">{{ $t('configuration.label') }}</h1>

        <p>Il n'est pas encore possible de modifier la configuration du mémo ici.</p>
        <ul class="list-disc">
            <li>
                Le ticket <a href="https://framagit.org/memo-fresques/memo-viewer/-/issues/153" class="link">#153</a> sur Framagit pour suivre
                l'avancée de cette nouvelle fonctionnalité
            </li>
            <li>
                La documentation <a href="https://memo.fresque.earth/#/admin/fresks" class="link">memo.fresque.earth</a> pour apprendre à modifier les
                fichiers de configuration même sans CMS passer sur le CMS
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SettingsPage',
    data() {
        return {};
    },
};
</script>

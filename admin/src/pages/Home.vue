<script setup>
import { ref, computed } from 'vue';
import { useGitlabStore } from '@/store/gitlab';
import { useSettingsStore } from '@/store/settings';

const settings = useSettingsStore();
const gitlab = useGitlabStore();

const tokenStatus = ref('');

const gitlabToken = computed({
    get: () => gitlab.gitlabToken,
    set: (newValue) => gitlab.setGitlabToken(newValue),
});
</script>

<template>
    <div class="text-center lg:text-left mx-8 my-auto">
        <h1 class="text-3xl font-bold">👋 Bienvenue !</h1>
        <p class="py-6">
            Cette interface permet de modifier les cartes, les liens et les traductions du mémo. Pour publier vos modifications sur le mémo, vous avez
            besoin d'un token d'identification au projet sur le dépôt <a class="link" :href="settings.repoUrl">{{ settings.repo }}</a
            >.
        </p>
        <p>Toutes vos modifications sont automatiquement sauvegardées dans votre ordinateur.</p>
        <ul class="mt-5">
            <li>La <a class="link" href="https://memo.fresque.earth/">documentation officielle</a> du mémo</li>
            <li>Le <a class="link" href="https://framagit.org/memo-fresques/">code source</a> du mémo et de cette interface d'administration</li>
        </ul>

        <div class="form-control w-full max-w-xs mb-8">
            <label class="label">
                <span class="label-text">Indique ton Token Git</span>
            </label>
            <input type="text" placeholder="glpat-xxxxx" :class="`input input-bordered w-full max-w-xs ${tokenStatus}`" v-model="gitlabToken" />
        </div>

        <p class="text-xs uppercase text-gray-600 font-bold">Dernier commit: {{ gitlab.commit }}</p>
    </div>
</template>

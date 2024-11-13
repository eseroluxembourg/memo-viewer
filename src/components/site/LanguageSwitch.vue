<script setup>
import { ChevronDownIcon, LanguageIcon } from '@heroicons/vue/24/outline';
import DropdownComponent from '@/components/site/Dropdown.vue';
import { languageString } from '@/utils/i18n';
import _langs from '@/data/langs.json';
import { useRoute } from 'vue-router';

const route = useRoute();

const langs = [..._langs].sort((a, b) => {
    if (a.code > b.code) return 1;
    if (a.code < b.code) return -1;
    return 0;
});
</script>

<template>
    <dropdown-component id="language-switch">
        <template v-slot:header>
            <LanguageIcon style="width: 1rem; height: 1rem" />
            <ChevronDownIcon style="width: 1rem; height: 1rem" />
        </template>
        <template v-slot:content>
            <div class="lang-switch-container">
                <router-link v-for="lang in langs" :key="lang.code" :to="{ name: route.name, params: { ...route.params, lang: lang.code } }">
                    <button :class="{ selected: lang.code === route.params.lang }">
                        {{ languageString(lang.code) }}
                    </button>
                </router-link>
                <span style="flex: 1"></span>
            </div>
        </template>
    </dropdown-component>
</template>

<style lang="sass" scoped>
.lang-switch-container
  margin: 10px
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  width: 550px
  @media only screen and (max-width: 768px)
    width: 400px

  @media only screen and (max-width: 480px)
    width: auto


.lang-switch-container button
  margin: 0.2rem
  border: none
  padding: 0.1rem 0.4rem
  font-size: 14px
  white-space: nowrap
  cursor: pointer
  border-radius: 5px
  color: white
  background-color: var(--primary)
  text-decoration: none
  &:hover, &.selected
    background-color: var(--secondary)
</style>

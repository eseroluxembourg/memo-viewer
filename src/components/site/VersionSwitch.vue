<script setup>
import DropdownComponent from '@/components/site/Dropdown.vue';
import { ChevronDownIcon, Cog8ToothIcon } from '@heroicons/vue/24/outline';
// import variants from '@/../variants.json';
import _variants from '@/../variants.json';
const defaultVersion = "v9.0";
const variants = {};
variants[defaultVersion] = _variants[defaultVersion];
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>
<template>
    <dropdown-component id="variant-switch">
        <template v-slot:header>
            <a class="menu-item" :to="{ name: 'RouteLangs', params: { lang: locale } }">
                <Cog8ToothIcon class="icon only-mobile" />
                <span class="only-computer">
                    {{ $route.params.version }}
                    <ChevronDownIcon style="height: 1rem; width: 1rem" />
                </span>
            </a>
        </template>
        <template v-slot:content>
            <div style="margin: 10px" class="variant-switch-container">
                <router-link
                    v-for="(version, index) in Object.keys(variants).filter((variant) => variants[variant].langs[locale] !== undefined)"
                    :key="index"
                    :to="{ name: $route.name, params: { ...$route.params, version: version } }"
                    :class="{ 'version-button': true, selected: $route.params.version === version }">
                    {{ version }}
                </router-link>
            </div>
        </template>
    </dropdown-component>
</template>

<style lang="sass" scoped>

.version-button
    margin: auto 0.2rem auto 0.2rem
    padding: 0.1rem 0.4rem
    font-size: 17px
    white-space: nowrap
    cursor: pointer
    border-radius: 5px
    color: white
    background-color: var(--primary)
    text-decoration: none
    &:hover,
    &.selected
      background-color: var(--secondary)
</style>

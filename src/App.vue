<script setup>
import { RouterView } from 'vue-router';
import MainNavbar from '@/components/site/MainNavbar.vue';
import AlertsComponent from './components/site/Alerts.vue';
import { guessLanguage } from './utils/i18n.js';
</script>

<template>
    <div id="nav" v-if="$route.params.lang !== undefined">
        <MainNavbar />
    </div>
    <div id="content">
        <router-view />
    </div>
    <alerts-component />
</template>

<script>
export default {
    name: 'app',
    mounted() {
        // Mounted is not called on server (during ssr)
        if (this.$route.params.lang === undefined || this.$route.params.lang === '') {
            const lang = guessLanguage();
            this.$router.replace({ name: this.$route.name, params: { ...this.$route.params, lang } });
        }
    },
};
</script>

<style>
body {
    margin: 0;
}

#app {
    font-family: Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    margin: 0;
    padding: 0.5rem 0;
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 3rem;
    z-index: 999;
    background-color: white;
}

#content {
    margin: auto 0;
    margin-top: 5.2rem;
}

a {
    color: var(--primary);
}
</style>

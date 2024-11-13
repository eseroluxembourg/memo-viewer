'use strict';

import { defineStore } from 'pinia';
import settingsFile from '!/settings.json';
import memoPackage from '!/package.json';
import { findBestAvailableLang } from '!/src/utils/i18n.js';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            version: memoPackage.version,
            settingsFile: settingsFile,
            _state: useStorage(`${settingsFile['gitlab']['repo']}/settings/gitlab`, {
                branch: '',
            }),
        };
    },
    getters: {
        host: (state) => {
            return state['settingsFile']['host'];
        },
        gitlab: (state) => {
            if (state._state.branch !== '') {
                return { ...state['settingsFile']['gitlab'], branch: state._state.branch };
            }
            return state['settingsFile']['gitlab'];
        },
        repoUrl: (state) => {
            return state.gitlab['base_url'] + state.gitlab['repo'];
        },
        repo: (state) => {
            return state.gitlab['repo'];
        },
        gitlabRawUrl: (state) => {
            return (filepath) => {
                return `${state.repoUrl}/-/raw/${state.gitlab['branch']}/${filepath}`;
            };
        },
        gitlabApiUrl: (state) => {
            return (apiQuery) => {
                return `${state.gitlab['base_url']}/api/v4/projects/${state.gitlab['project_id']}/${apiQuery}?ref=${state.gitlab['branch']}`;
            };
        },
        freskLabel: (state) => {
            return (i18n) => {
                const bestLang = findBestAvailableLang(i18n, Object.keys(state.settingsFile['fresk-label']));
                return state.settingsFile['fresk-label'][bestLang];
            };
        },
        contact: (state) => {
            return state.settingsFile['contact'];
        },
        memoVersion: (state) => {
            return state['version'];
        },
    },
    actions: {
        setGitlabBranch(value) {
            this._state.branch = value;
        },
    },
});

'use strict';

import { defineStore } from 'pinia';
import { useSettingsStore } from '@/store/settings';

import { useStorage } from '@vueuse/core';
import { fileContentStillValid, listFilesStillValid } from '@/utils/incrementalcommit';
import _set from 'lodash.set';
import { Mutex } from 'async-mutex';

export const useGitlabStore = defineStore('gitlab', {
    state: () => {
        return {
            _state: useStorage(
                `${useSettingsStore().repo}/gitlab`,
                {
                    token: '',
                    commit: '',
                    triggerToken: '',
                },
                localStorage,
            ),
            _files: useStorage(
                `${useSettingsStore().repo}/gitlab/files`,
                {
                    files: {},
                },
                localStorage,
            ),
            _localCache: {
                listFilesStillValid: {},
            },
            displaySuccessAlertToken: false,
            tokenStatus: '',
            errorMessage: '',
            mutex: new Mutex(),
        };
    },
    getters: {
        gitlabToken: (state) => {
            return state._state.token;
        },
        gitlabTriggerToken: (state) => {
            return state._state.triggerToken;
        },
        gitlabHeaders: (state) => {
            return {
                'PRIVATE-TOKEN': state._state.token,
                'Content-Type': 'application/json',
            };
        },
        commit: (state) => {
            return state._state.commit;
        },
    },
    actions: {
        resetCache() {
            this._state.commit = '';
            this._files.files = {};
        },
        setGitlabToken(gitlabToken) {
            this._state.token = gitlabToken;

            this.tokenStatus = '';
            this.requestFile('package.json')
                .then(() => {
                    this.tokenStatus = 'input-success';
                    this.displaySuccessAlertToken = true;
                    setTimeout(() => (this.displaySuccessAlertToken = false), 7000);
                })
                .catch(() => (this.tokenStatus = 'input-error'));
        },
        setGitlabTrigerToken(token) {
            this._state.triggerToken = token;
        },
        requestFile(filepath, cache) {
            // GET /projects/:id/repository/files/:file_path/raw
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/repository/files/${encodeURIComponent(filepath)}/raw?ref=${
                gs['branch']
            }`;
            const extension = filepath.split('.').pop();
            return this.fetch(url, extension, cache, async (beforeCommit, toCommit) => {
                const ok = await fileContentStillValid(await this.listModifications(beforeCommit, toCommit), filepath);
                return ok;
            });
        },
        async listFilesStillValid(beforeCommit, toCommit, path) {
            if (this._localCache.listFilesStillValid[(beforeCommit, toCommit, path)] === true) return true;
            const diff = await this.listModifications(beforeCommit, toCommit);
            const result = listFilesStillValid(diff, path);
            this._localCache.listFilesStillValid[(beforeCommit, toCommit, path)] = result;
            return result;
        },
        async _listFiles(path, page, cache, recursive) {
            // GET /projects/:id/repository/tree
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/repository/tree?ref=${gs['branch']}&path=${encodeURIComponent(
                path,
            )}&page=${page}&recursive=${recursive === true}`;
            return (
                await this.fetch(url, 'json', cache, async (beforeCommit, toCommit) => await this.listFilesStillValid(beforeCommit, toCommit, path))
            ).map((r) => r.path);
        },
        async listFiles(path, cache, recursive) {
            let page = 1;

            let result = [];
            while (result.length == 20 * (page - 1)) {
                result = result.concat(await this._listFiles(path, page, cache, recursive));
                page += 1;
            }

            if (recursive === true) {
                const paths = result.filter((f) => f.indexOf('.') > -1).map((r) => r.split('/'));
                const tree = {};
                for (const p of paths) {
                    if (p[p.length - 1] === '.gitkeep') continue;

                    _set(tree, p, p[p.length - 1]);
                }
                return tree;
            } else {
                return result;
            }
        },
        async listModifications(fromCommit, toCommit) {
            // GET /projects/:id/repository/compare
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/repository/compare?from=${fromCommit}&to=${toCommit}`;

            const response = await new Promise((resolve) => {
                this.mutex.acquire().then((release) => {
                    this.fetch(url, 'json', 1).then((response) => {
                        release();
                        resolve(
                            response['diffs'].map((d) => ({
                                newPath: d.new_path,
                                oldPath: d.old_path,
                                newFile: d.new_file,
                                deletedFile: d.deleted_file,
                                renamedFile: d.renamed_file,
                            })),
                        );
                    });
                });
            });
            return response;
        },
        // Cache === 0 no cache
        // Cache === 1 cache
        // Cache === 2 force cache
        async fetch(url, extension, cache, remainValidBetweenCommits) {
            let askedCommit;
            if (cache >= 1) {
                askedCommit = cache === 1 ? await this.computeAndGetLastCommit() : this.getLastCommit();
                if (this._files.files[url] && this._files.files[url]['commit']) {
                    if (this._files.files[url]['commit'] === askedCommit) {
                        return this._files.files[url]['value'];
                    }

                    if (remainValidBetweenCommits !== undefined && (await remainValidBetweenCommits(this._files.files[url]['commit'], askedCommit))) {
                        this._files.files[url]['commit'] = askedCommit;
                        return this._files.files[url]['value'];
                    }
                }

                if (cache === 2) return undefined;
            }

            const result = await new Promise((resolve, reject) => {
                fetch(url, { method: 'GET', headers: this.gitlabHeaders })
                    .then((response) => {
                        if (!response.ok) {
                            if (response.status == 401) {
                                this.errorMessage = `Unauthorized token (probably a mistake ?)`;
                            }
                            reject(new Error(`Error status code ${response.status}`));
                            return;
                        }
                        this.errorMessage = '';

                        if (extension === 'json') return response.json();
                        else if (extension === 'md') return response.text();
                        throw new Error(`fetch not implemented for extension ${extension}`);
                    })
                    .then((response) => resolve(response));
            });

            if (cache >= 1) {
                this._files.files[url] = {
                    commit: askedCommit,
                    value: result,
                };
            }
            return result;
        },
        async computeLastCommit() {
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/repository/branches/${encodeURIComponent(gs['branch'])}`;
            const response = await this.fetch(url, 'json', 0);
            return response['commit'];
        },
        // getLastCommit ?
        getLastCommit() {
            return this._state.commit;
        },
        async computeAndGetLastCommit() {
            if (this._state.commit) return this._state.commit;
            return await this.pull();
        },
        async pull() {
            // GET /projects/:id/repository/branches/:branch
            this._state.commit = (await this.computeLastCommit())['id'];
            return this._state.commit;
        },
        // Currently unused
        async getUserData() {
            // GET /users
            // const gs = useSettingsStore().gitlab;
            // const url = `${gs['base_url']}/api/v4/users`;
            // const response = await this.fetch(url, 'json', 0);
        },
        async createAndPostCommit(commitMessage, actions) {
            if (actions.length === 0) return;

            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/repository/commits`;

            const body = {
                branch: gs['branch'],
                commit_message: commitMessage,
                actions: actions,
            };
            return new Promise((resolve, reject) => {
                fetch(url, { method: 'POST', headers: this.gitlabHeaders, body: JSON.stringify(body) }).then((response) => {
                    if (!response.ok) {
                        reject(new Error(`Erreur lors du commit, code ${response.status}`));
                        return;
                    }
                    resolve();
                });
            });
        },
        async triggerCI(variables) {
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/trigger/pipeline`;

            const body = {
                ref: gs['branch'],
                variables: variables,
                token: this._state.triggerToken,
            };

            return new Promise((resolve, reject) => {
                fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((response) => {
                    if (!response.ok) {
                        reject(new Error(`Erreur lors du déclenchement de la CI, code ${response.status}`));
                        return;
                    }
                    resolve();
                });
            });
        },
        // Currently unused
        async listPipelines() {
            const gs = useSettingsStore().gitlab;
            const url = `${gs['base_url']}/api/v4/projects/${gs['project_id']}/pipelines?ref=${gs.branch}&yaml_errors=false"`;

            const result = await new Promise((resolve, reject) => {
                fetch(url, { method: 'GET', headers: this.gitlabHeaders })
                    .then((response) => {
                        if (!response.ok) {
                            this.errorMessage = `Error for fetch ${url} (.json). Response: ${response.status}`;
                            reject(new Error(`Error status code ${response.status}`));
                            return;
                        }
                        return response.json();
                    })
                    .then((response) => resolve(response));
            });
            return result;
        },
    },
});

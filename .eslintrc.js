module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        // 'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error', 'assert'] }] : 'off',
        'no-unused-vars': [process.env.NODE_ENV === 'production' ? 'error' : 'off', { argsIgnorePattern: '^_' }],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unreachable': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-invalid-this': 'error',
        'vue/no-deprecated-router-link-tag-prop': 'warn',
        'vue/this-in-template': 'error',
        'vue/multi-word-component-names': 0,
    },
};

import { defineConfig } from 'oxlint';

export default defineConfig({
  env: {
    browser: true,
    builtin: true,
  },
  jsPlugins: ['@tanstack/eslint-plugin-router', '@tanstack/eslint-plugin-query'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react', 'react-perf', 'import', 'jsdoc', 'jsx-a11y', 'promise'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/infinite-query-property-order': 'error',
    '@tanstack/query/mutation-property-order': 'error',
    '@tanstack/query/no-rest-destructuring': 'error',
    '@tanstack/query/no-unstable-deps': 'error',
    '@tanstack/query/no-void-query-fn': 'error',
    '@tanstack/query/stable-query-client': 'error',
    '@tanstack/router/create-route-property-order': 'error',
  },
  settings: {
    react: {
      version: '19.2',
    },
  },
});

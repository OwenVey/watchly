import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'react', 'react-perf', 'import', 'jsdoc', 'jsx-a11y', 'promise'],
  jsPlugins: ['@tanstack/eslint-plugin-router', '@tanstack/eslint-plugin-query'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    '@tanstack/router/create-route-property-order': 'error',
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'error',
    '@tanstack/query/stable-query-client': 'error',
    '@tanstack/query/no-unstable-deps': 'error',
    '@tanstack/query/infinite-query-property-order': 'error',
    '@tanstack/query/no-void-query-fn': 'error',
    '@tanstack/query/mutation-property-order': 'error',
  },
  settings: {
    react: {
      version: '19.2',
    },
  },
  env: {
    builtin: true,
    browser: true,
  },
});

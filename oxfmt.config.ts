import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: ['routeTree.gen.ts'],
  singleQuote: true,
  printWidth: 120,
  sortTailwindcss: {
    stylesheet: 'src/index.css',
  },
  sortPackageJson: {
    sortScripts: true,
  },
  sortImports: {
    newlinesBetween: false,
  },
  jsdoc: true,
});

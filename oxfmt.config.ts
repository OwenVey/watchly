import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: ['routeTree.gen.ts', 'env.d.ts'],
  jsdoc: true,
  printWidth: 120,
  singleQuote: true,
  sortImports: {
    newlinesBetween: false,
  },
  sortPackageJson: {
    sortScripts: true,
  },
  sortTailwindcss: {
    stylesheet: 'src/styles.css',
  },
});

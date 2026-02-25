import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isVercel = process.env.VERCEL === '1';
  const shouldAnalyze = process.env.ANALYZE === 'true' && !isVercel;

  return {
    plugins: [
      tsconfigPaths(),
      devtools({
        consolePiping: {
          enabled: false,
        },
      }),
      tanstackRouter({
        target: 'react',
      }),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
      ...(shouldAnalyze ? [analyzer()] : []),
    ],
  };
});

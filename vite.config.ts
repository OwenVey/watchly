import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isVercel = process.env.VERCEL === '1';
  const shouldAnalyze = process.env.ANALYZE === 'true' && !isVercel;

  return {
    preview: {
      port: 3000,
      host: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tanstackDevtools({
        consolePiping: {
          enabled: false,
        },
      }),
      tanstackRouter({
        target: 'react',
      }),
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      tailwindcss(),
      ...(shouldAnalyze ? [analyzer()] : []),
    ],
  };
});

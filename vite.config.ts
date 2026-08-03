import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  plugins: [
    devtools({
      consolePiping: {
        enabled: false,
      },
    }),
    varlockCloudflareVitePlugin({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  resolve: { tsconfigPaths: true },
});

export default config;

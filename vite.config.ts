import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration';
import react from '@vitejs/plugin-react';
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
    react({ compiler: true }),
  ],
  resolve: { tsconfigPaths: true },
});

export default config;

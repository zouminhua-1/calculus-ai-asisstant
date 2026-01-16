import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import clean from 'vite-plugin-clean';
import react from '@vitejs/plugin-react';
import pxToViewport from 'postcss-px-to-viewport-8-plugin';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/

export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    css: {
      postcss: {
        plugins: [
          pxToViewport({
            viewportWidth: 375,
            unitPrecision: 8,
            viewportUnit: 'vmin',
            fontViewportUnit: 'vmin',
          }),
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    plugins: [
      // @ts-ignore
      clean({ targetFiles: ['dist'] }),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      open: true,
      proxy: {
        '/cros': {
          target: env.VITE_DIFY_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cros/, ''),
        },
      },
    },
  });
};

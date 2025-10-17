// @ts-check
import {defineConfig} from 'astro/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';

// https://astro.build/config
export default defineConfig({
	site: 'https://ruitais.github.io',
	vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@styles': path.resolve('./src/styles'),
        '@scripts': path.resolve('./src/scripts'),
      },
    },
    plugins: [
      viteStaticCopy({
        targets: [
          // copy the ORT wasm files from the package into the build output
          { src: 'node_modules/onnxruntime-web/dist/*.wasm', dest: 'ort' },
        ],
      }),
    ],
  },
});

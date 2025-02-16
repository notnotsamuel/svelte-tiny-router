// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/lib/index.js',
      name: 'SvelteTinyRouter',
      fileName: (format) => `svelte-tiny-router.${format}.js`
    },
    rollupOptions: {
      // Exclude Svelte from the bundle (it should be a peer dependency)
      external: ['svelte'],
      output: {
        globals: {
          svelte: "Svelte",
        },
      },
    }
  },
  plugins: [
    svelte({
      compilerOptions: {
        runes: true  // Enable Svelte 5 runes (e.g. $state, $derived, $props)
      }
    })
  ]
});

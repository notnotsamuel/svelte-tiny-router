// vite.config.js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',           // Your library’s entry point
      name: 'SvelteTinyRouter',        // Global variable name (for UMD/IIFE builds)
      fileName: (format) => `svelte-tiny-router.${format}.js`
    },
    rollupOptions: {
      // Exclude Svelte from the bundle (it should be a peer dependency)
      external: ['svelte']
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

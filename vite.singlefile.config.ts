import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One-off build that inlines all JS/CSS into a single self-contained
// index.html, for hosting the prototype as a shareable Artifact.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  build: { outDir: 'dist-single', cssCodeSplit: false, assetsInlineLimit: 100000000 },
});

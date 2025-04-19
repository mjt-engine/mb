import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Module",
      fileName: "index",
      // formats: ['iife'], // Or 'umd', 'es', 'cjs'
    },
    rollupOptions: {
      external: [], // Leave empty for fully self-contained
    },
    // minify: true,
    target: "esnext",
  },
});

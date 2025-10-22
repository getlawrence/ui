import { defineConfig } from 'vite';
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: './gallery',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  optimizeDeps: {
    include: [
      '@xyflow/react',
      '@monaco-editor/react',
      'js-yaml',
      'react',
      'react-dom',
    ],
  },
  build: {
    outDir: '../dist-gallery',
  },
});


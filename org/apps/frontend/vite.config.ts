/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"

const PORT = parseInt(process.env.NGINX_PORT || "4200")

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',
  server: {
    port: PORT,
    host: 'localhost',
    watch: {
      ignored: ['!../../libs/schema/**'],
    },
  },
  define: {
    'process.env.EXPRESS_PORT': process.env.EXPRESS_PORT
  },
  preview: {
    port: PORT,
    host: 'localhost',
  },
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: '@org/frontend',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
  optimizeDeps: {
    include: [
      '@libs/schema',
    ],
    force: true,
  },
  resolve: {
    alias: {
      "@libs": path.resolve(__dirname, "../../libs"),
    }
  }
}));

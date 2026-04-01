import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'LinglongDashboard',
      fileName: 'linglong-dashboard',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@services': resolve(__dirname, 'src/services'),
      '@types': resolve(__dirname, 'src/types'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:18789',
        changeOrigin: true,
        ws: true
      },
      '/ws': {
        target: 'ws://127.0.0.1:18789',
        ws: true
      }
    }
  },
  css: {
    devSourcemap: true
  }
});

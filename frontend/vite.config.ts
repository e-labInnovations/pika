import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['/pika/lucide.svg'],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/pika\/lucide\.svg$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lucide-sprite-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Pika Finance',
        short_name: 'Pika',
        description: 'Simple personal finance management',
        theme_color: '#0e171e',
        background_color: '#0e171e',
        display: 'standalone',
        scope: '/pika',
        start_url: '/pika',
        orientation: 'portrait',
        lang: 'en-US',
        categories: [
          'finance',
          'accounting',
          'budgeting',
          'financial-management',
          'financial-planning',
          'financial-analysis',
          'financial-reporting',
          'financial-planning',
          'financial-analysis',
          'financial-reporting',
        ],
        shortcuts: [
          {
            name: 'Home',
            url: '/pika',
            icons: [{ src: '/pika/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Add Transaction',
            url: '/pika/add',
            icons: [{ src: '/pika/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          {
            src: '/pika/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pika/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pika/icons/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/pika/icons/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/pika/ss_1.png',
            sizes: '1840x3600',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home Dashboard',
          },
          {
            src: '/pika/ss_2.png',
            sizes: '1840x3600',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Transactions List',
          },
          {
            src: '/pika/ss_desktop_1.png',
            sizes: '2560x1440',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop Dashboard',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/wp-json': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../frontend-build',
  },
  base: '/pika',
});

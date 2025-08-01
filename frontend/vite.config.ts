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
        description: 'Pika Financial Management',
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
            icons: [{ src: '/pika/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Add Transaction',
            url: '/pika/add',
            icons: [{ src: '/pika/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          {
            src: '/pika/icons/icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/pika/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
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

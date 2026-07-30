import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.mp4', '**/*.webm'],
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'مؤسسة رحماء بينهم الخيرية',
        short_name: 'رحماء بينهم',
        description: 'منصة خيرية شاملة للتبرع والتطوع والعمل الإنساني',
        theme_color: '#1A5C48',
        background_color: '#FAFAF7',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['charity', 'donation', 'social'],
        shortcuts: [
          {
            name: 'تبرع سريع',
            url: '/donate',
            icons: [{ src: '/icons/donate-96.png', sizes: '96x96' }]
          },
          {
            name: 'آخر الأخبار',
            url: '/news',
            icons: [{ src: '/icons/news-96.png', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'sanity-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true,
        // CRITICAL: Don't let SW intercept API calls that may fail CORS
        navigateFallback: null,
        navigateFallbackDenylist: [/\/api\//, /\/v\d\/data\//],
      }
    }),
  ],

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@emotion/react'],
          'sanity-vendor': ['@sanity/client', '@sanity/image-url'],
          'utils-vendor': ['date-fns', 'clsx', 'tailwind-merge'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    hmr: {
      overlay: true
    },
    proxy: {
      // ===== SANITY API PROXY - حل مشكلة CORS =====
      '/api/sanity': {
        target: 'https://xd0ohyiz.api.sanity.io',
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/api\/sanity/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // إضافة CORS headers للرد
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        },
      },
      // ===== GENERAL API PROXY =====
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true
  }
});

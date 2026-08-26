import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';

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
    compression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false, threshold: 1024, verbose: false }),
    compression({ algorithm: 'brotliCompress', ext: '.br', deleteOriginFile: false, threshold: 1024, verbose: false }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'robots.txt', 'offline.html'],
      manifest: {
        name: 'رحماء بينهم',
        short_name: 'رحماء بينهم',
        description: 'الموقع الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن',
        theme_color: '#059669',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        categories: ['charity', 'donation', 'social'],
        shortcuts: [
          { name: 'تبرع سريع', url: '/donate', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'آخر الأخبار', url: '/news', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'حاسبة الزكاة', url: '/zakat', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        globIgnores: ['**/videos/**'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'sanity-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|gif|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/\/api\//, /\/v\d\/data\//],
      },
    }),
  ],

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
      },
    },
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vite/preload-helper') || /[\\/]node_modules[\\/]tslib[\\/]/.test(id)) {
            return undefined;
          }
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react';
          }
          if (/[\\/]node_modules[\\/]@radix-ui[\\/]/.test(id)) {
            return 'vendor-ui';
          }
          if (/[\\/]node_modules[\\/](recharts|d3-shape|d3-scale|victory-vendor)[\\/]/.test(id)) {
            return 'vendor-charts';
          }
          if (/[\\/]node_modules[\\/](framer-motion|motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'vendor-motion';
          }
          if (/[\\/]node_modules[\\/]@sanity[\\/]/.test(id)) {
            return 'vendor-sanity';
          }
          if (/[\\/]node_modules[\\/](dompurify)[\\/]/.test(id)) {
            return 'security-vendor';
          }
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    hmr: {
      overlay: true
    },
    proxy: {
      '/api/sanity': {
        target: 'https://xd0ohyiz.api.sanity.io',
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/api\/sanity/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        },
      },
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

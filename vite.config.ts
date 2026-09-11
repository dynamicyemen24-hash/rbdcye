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
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'robots.txt', 'offline.html', 'sitemap.xml', 'manifest.json'],
      manifest: {
        name: 'رحماء بينهم',
        short_name: 'رحماء بينهم',
        description: 'الموقع الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن',
        theme_color: '#0F4C3A',
        background_color: '#0F4C3A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ar',
        dir: 'rtl',
        prefer_related_applications: false,
        categories: ['charity', 'donation', 'social', 'lifestyle'],
        shortcuts: [
          { name: 'تبرع سريع', url: '/donate', description: 'تبرع الآن وسريعاً', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'آخر الأخبار', url: '/news', description: 'تصفح آخر الأخبار', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'حاسبة الزكاة', url: '/zakat', description: 'احسب زكاتك بدقة', icons: [{ src: '/icons/pwa-192x192.png', sizes: '192x192' }] },
        ],
        screenshots: [
          { src: '/og-image.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'صفحة رئيسية' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2,woff,ttf,json,xml}'],
        globIgnores: ['**/videos/**', '**/maps/**', '**/analytics/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
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
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|gif|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-images',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.stripe\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'stripe-api',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
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
    modulePreload: { polyfill: true },
    terserOptions: {
      compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        ecma: 2020,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? assetInfo.names?.[0] ?? 'asset';
          const info = name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|ttf|eot)$/i.test(name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          if (/\.css$/i.test(name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
        manualChunks(id) {
          if (id.includes('vite/preload-helper') || /[\\/]node_modules[\\/]tslib[\\/]/.test(id)) {
            return undefined;
          }
          if (!id.includes('node_modules')) return undefined;

          // React core - highest priority
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react';
          }
          // Supabase - check before vendor-other to avoid circular
          if (/[\\/]node_modules[\\/]@supabase[\\/]/.test(id)) {
            return 'vendor-supabase';
          }
          // UI Libraries
          if (/[\\/]node_modules[\\/]@radix-ui[\\/]/.test(id)) {
            return 'vendor-ui';
          }
          // Charts & Visualization
          if (/[\\/]node_modules[\\/](recharts|d3-shape|d3-scale|d3-array|d3-interpolate|victory-vendor)[\\/]/.test(id)) {
            return 'vendor-charts';
          }
          // Animation
          if (/[\\/]node_modules[\\/](framer-motion|motion|motion-dom|motion-utils|@motionone)[\\/]/.test(id)) {
            return 'vendor-motion';
          }
          // Sanity CMS
          if (/[\\/]node_modules[\\/]@sanity[\\/]/.test(id)) {
            return 'vendor-sanity';
          }
          // Security
          if (/[\\/]node_modules[\\/](dompurify)[\\/]/.test(id)) {
            return 'security-vendor';
          }
          // Icons
          if (/[\\/]node_modules[\\/](lucide-react)[\\/]/.test(id)) {
            return 'vendor-icons';
          }
          // Carousel
          if (/[\\/]node_modules[\\/](embla-carousel-react|embla-carousel)[\\/]/.test(id)) {
            return 'vendor-carousel';
          }
          // Maps
          if (/[\\/]node_modules[\\/](leaflet)[\\/]/.test(id)) {
            return 'vendor-map';
          }
          // Date utilities
          if (/[\\/]node_modules[\\/](date-fns)[\\/]/.test(id)) {
            return 'vendor-date';
          }
          // Feedback/Toast/Modal
          if (/[\\/]node_modules[\\/](sonner|vaul|cmdk)[\\/]/.test(id)) {
            return 'vendor-feedback';
          }
          // Style utilities
          if (/[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/.test(id)) {
            return 'vendor-style';
          }
          // Stripe
          if (/[\\/]node_modules[\\/]@stripe[\\/]/.test(id)) {
            return 'vendor-stripe';
          }
          // Zod validation
          if (/[\\/]node_modules[\\/]zod[\\/]/.test(id)) {
            return 'vendor-validation';
          }
          // Common utilities
          if (/[\\/]node_modules[\\/](lodash-es|lodash|ramda)[\\/]/.test(id)) {
            return 'vendor-utils';
          }
          // Let Rollup place remaining deps to avoid circular chunks
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    cssMinify: 'esbuild',
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
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'recharts'],
    exclude: ['@supabase/supabase-js'],
  },
  preview: {
    port: 4173,
    host: true
  }
});

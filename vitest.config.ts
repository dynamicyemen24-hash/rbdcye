import { defineConfig } from 'vitest/config';
import path from 'path';

console.log('CFG_LOADED_vitest_config');

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'src/features/core/testing'],
    deps: {
      optimizer: {
        web: { enabled: false },
        ssr: { enabled: false },
      },
    },
    server: {
      deps: {
        // vite-node matches STRINGS via path.join('/node_modules/', name)
        // (BACKSLASHES on Windows → never matches the forward-slash file
        // path), while REGEXES are tested directly against the resolved
        // path. Defaults inline-evaluate react's CJS inside vite-node
        // (instance Y) while react-dom's internal require('react') loads
        // Node's copy (instance X) → two Reacts → null dispatcher /
        // "Invalid hook call". Forcing react external makes BOTH sides load
        // through Node's native loader — one shared instance.
        external: [
          /\/node_modules\/react\//,
          /\/node_modules\/react-dom\//,
          /\/node_modules\/@testing-library\/react\//,
        ],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.{ts,tsx}', 'src/**/index.ts', 'src/vite-env.d.ts'],
      thresholds: {
        statements: 60,
        branches: 45,
        functions: 60,
        lines: 60,
      },
    },
  },
});

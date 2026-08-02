// ============================================================
// ESLint Configuration
// ============================================================
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/set-state-in-effect': 'off',

    // Import
    'import/order': 'off',
    'import/no-named-as-default': 'off',

    // General
    'no-console': 'off',
    'prefer-const': 'off',
    'no-var': 'off',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
  ],
  overrides: [
    {
      files: ['*.config.js', '*.config.cjs', '.eslintrc.cjs'],
      parserOptions: {
        project: null,
      },
    },
    {
      files: ['sanity.cli.ts', 'sanity.config.ts'],
      parserOptions: {
        project: null,
      },
    },
    {
      files: ['public/sw.js'],
      parserOptions: {
        project: null,
      },
      globals: {
        self: 'readonly',
        clients: 'readonly',
        caches: 'readonly',
        indexedDB: 'readonly',
        fetch: 'readonly',
      },
    },
    {
      files: ['api/**/*.js', 'api/**/*.cjs', 'api/**/*.ts'],
      parserOptions: {
        project: null,
      },
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
  ],
};
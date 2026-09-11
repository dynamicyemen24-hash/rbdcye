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
    // TypeScript — world-class: warn on sloppy types but allow gradual migration
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',

    // React Hooks — world-class: catch missing deps
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/set-state-in-effect': 'warn',

    // Accessibility — re-enable critical rules, keep balanced
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/no-autofocus': 'warn',

    // Import — enforce order for readability
    'import/order': ['warn', { groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'], 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'warn',

    // General — world-class discipline
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-nested-ternary': 'warn',
    'eqeqeq': ['error', 'always'],
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '**/*.css',
    '**/*.scss',
    '**/*.less',
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
      files: ['api/**/*.js', 'api/**/*.cjs', 'api/**/*.ts', 'functions/**/*.js'],
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
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['src/utils/**/*', 'src/main.tsx', 'src/app/App.tsx'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['src/__tests__/**/*', 'e2e/**/*', '**/*.test.*', '**/*.spec.*', 'scripts/**/*'],
      parserOptions: { project: null },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    },
  ],
};
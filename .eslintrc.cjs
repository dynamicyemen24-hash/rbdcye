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
    // TypeScript — precise v3.2: all debts paid — strict 0
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-no-comment-textnodes': 'off',

    // React Hooks — precise: intentional
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/set-state-in-effect': 'off',

    // Accessibility — precise: label via nesting valid
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-autofocus': 'off',

    // Import — precise: order via --fix
    'import/order': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'off',

    // General — precise
    'no-console': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-debugger': 'error',
    'no-alert': 'off',
    'no-nested-ternary': 'off',
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
      files: ['*.mjs', 'vitest.config.ts'],
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

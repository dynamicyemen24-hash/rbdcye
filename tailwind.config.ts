import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        // Direct pixel variables mapping (4px to 128px)
        '4px': 'var(--spacing-4)',
        '8px': 'var(--spacing-8)',
        '12px': 'var(--spacing-12)',
        '16px': 'var(--spacing-16)',
        '20px': 'var(--spacing-20)',
        '24px': 'var(--spacing-24)',
        '28px': 'var(--spacing-28)',
        '32px': 'var(--spacing-32)',
        '36px': 'var(--spacing-36)',
        '40px': 'var(--spacing-40)',
        '44px': 'var(--spacing-44)',
        '48px': 'var(--spacing-48)',
        '52px': 'var(--spacing-52)',
        '56px': 'var(--spacing-56)',
        '60px': 'var(--spacing-60)',
        '64px': 'var(--spacing-64)',
        '72px': 'var(--spacing-72)',
        '80px': 'var(--spacing-80)',
        '88px': 'var(--spacing-88)',
        '96px': 'var(--spacing-96)',
        '104px': 'var(--spacing-104)',
        '112px': 'var(--spacing-112)',
        '120px': 'var(--spacing-120)',
        '128px': 'var(--spacing-128)',

        // Token aliases
        'token-4': 'var(--spacing-4)',
        'token-8': 'var(--spacing-8)',
        'token-12': 'var(--spacing-12)',
        'token-16': 'var(--spacing-16)',
        'token-20': 'var(--spacing-20)',
        'token-24': 'var(--spacing-24)',
        'token-28': 'var(--spacing-28)',
        'token-32': 'var(--spacing-32)',
        'token-36': 'var(--spacing-36)',
        'token-40': 'var(--spacing-40)',
        'token-44': 'var(--spacing-44)',
        'token-48': 'var(--spacing-48)',
        'token-52': 'var(--spacing-52)',
        'token-56': 'var(--spacing-56)',
        'token-60': 'var(--spacing-60)',
        'token-64': 'var(--spacing-64)',
        'token-72': 'var(--spacing-72)',
        'token-80': 'var(--spacing-80)',
        'token-88': 'var(--spacing-88)',
        'token-96': 'var(--spacing-96)',
        'token-104': 'var(--spacing-104)',
        'token-112': 'var(--spacing-112)',
        'token-120': 'var(--spacing-120)',
        'token-128': 'var(--spacing-128)',
      },
      fontSize: {
        // Fluid typography scale utility mapping
        display: ['var(--font-size-display)', { lineHeight: '1.15' }],
        h1: ['var(--font-size-h1)', { lineHeight: '1.25' }],
        h2: ['var(--font-size-h2)', { lineHeight: '1.3' }],
        h3: ['var(--font-size-h3)', { lineHeight: '1.35' }],
        h4: ['var(--font-size-h4)', { lineHeight: '1.4' }],
        'body-lg': ['var(--font-size-body-lg)', { lineHeight: '1.6' }],
        body: ['var(--font-size-body)', { lineHeight: '1.6' }],
        caption: ['var(--font-size-caption)', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default config;

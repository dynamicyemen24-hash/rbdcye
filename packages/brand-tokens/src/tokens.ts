/**
 * NexoraOS™ — Unified Brand Tokens
 * Single Source of Truth for NexWebSite / NexoraOS / NexOSMobile
 * Aligned with AGENTS.md Brand Standard + WCAG 2.1 AAA
 */
export const brandTokens = {
  // Primary — Emerald (AGENTS.md: #059669)
  primary: '#059669',
  primaryHover: '#047857',
  primaryDark: '#0F4C3A',
  primaryLight: '#10B981',
  primaryPale: '#ECFDF5',
  primaryRgb: '5, 150, 105',

  // Accent — Gold/Amber (AGENTS.md: #d97706)
  accent: '#d97706',
  accentHover: '#b45309',
  accentLight: '#FBBF24',
  accentPale: '#FFFBEB',
  accentRgb: '217, 119, 6',

  // Legacy aliases for NexWebSite backward compat (map to same palette)
  brandGreen: '#059669',
  brandGreenDark: '#0F4C3A',
  brandGreenLight: '#10B981',
  brandGold: '#d97706',

  // Dark/Light surfaces (AGENTS.md)
  darkBg: '#090d16',
  darkSurface: '#111827',
  lightBg: '#f8fafc',
  lightSurface: '#ffffff',

  // Semantic
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0ea5e9',

  // WCAG AAA helpers
  goldWcagAAA: '#5C3E00',
  goldWcagDarkBg: '#FBBF24',
} as const;

export type BrandTokens = typeof brandTokens;

export const cssVariables = `
:root {
  --brand-primary: ${brandTokens.primary};
  --brand-accent: ${brandTokens.accent};
  --brand-dark-bg: ${brandTokens.darkBg};
  --brand-light-bg: ${brandTokens.lightBg};
  --brand-green: ${brandTokens.primary};
  --brand-green-dark: ${brandTokens.primaryDark};
  --brand-gold: ${brandTokens.accent};
}
` as const;

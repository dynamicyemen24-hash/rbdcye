/**
 * Rahma Baynahum — Unified Brand Tokens
 * Single Source of Truth for the official institutional website
 * Aligned with AGENTS.md Brand Standard + WCAG 2.1 AA/AAA
 *
 * Brand Constitution:
 * - Primary: Emerald #0F4C3A (Islamic emerald)
 * - Accent: Gold #C69E5A (moderate gold)
 * - Typography: Cairo (Arabic) + Plus Jakarta Sans (Latin)
 * - Direction: RTL (Arabic)
 */
export const brandTokens = {
  // Primary — Emerald (AGENTS.md: #0F4C3A)
  primary: '#0F4C3A',
  primaryHover: '#17694F',
  primaryDark: '#0A3527',
  primaryLight: '#17694F',
  primaryPale: '#E9F1EC',
  primaryRgb: '15, 76, 58',

  // Accent — Gold (AGENTS.md: #C69E5A)
  accent: '#C69E5A',
  accentHover: '#D6B274',
  accentDark: '#8F6A1A',
  accentLight: '#D6B274',
  accentPale: '#F7EFE0',
  accentRgb: '198, 158, 90',

  // Legacy aliases for backward compatibility (map to same palette)
  brandGreen: '#0F4C3A',
  brandGreenDark: '#0A3527',
  brandGreenLight: '#17694F',
  brandGold: '#C69E5A',
  brandGoldDark: '#8F6A1A',
  brandGoldLight: '#D6B274',

  // Dark/Light surfaces
  darkBg: '#0A0F15',
  darkSurface: '#111827',
  lightBg: '#F8F5EC',
  lightSurface: '#FFFFFF',

  // Semantic
  success: '#17694F',
  warning: '#D68910',
  danger: '#C0392B',
  info: '#2563EB',

  // WCAG AAA helpers
  goldWcagAAA: '#5C3E00',
  goldWcagDarkBg: '#FBBF24',

  // Typography
  fontFamilyArabic: 'Cairo',
  fontFamilyLatin: 'Plus Jakarta Sans',
  fontFamilyBase: 'Cairo, Plus Jakarta Sans, system-ui, sans-serif',
  fontSizeBase: '16px',
  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.125rem',
  fontSizeXl: '1.25rem',
  fontSize2xl: '1.5rem',
  fontSize3xl: '1.875rem',
  fontSize4xl: '2.25rem',
  fontSize5xl: '3rem',
  lineHeightTight: '1.25',
  lineHeightSnug: '1.375',
  lineHeightNormal: '1.5',
  lineHeightRelaxed: '1.625',

  // Spacing
  space3xs: '0.25rem',
  space2xs: '0.5rem',
  spaceXs: '0.75rem',
  spaceSm: '1rem',
  spaceMd: '1.5rem',
  spaceLg: '2rem',
  spaceXl: '3rem',
  space2xl: '4rem',
  space3xl: '6rem',
  space4xl: '8rem',

  // Radius
  radiusSm: '0.25rem',
  radiusMd: '0.375rem',
  radiusLg: '0.5rem',
  radiusXl: '0.75rem',
  radius2xl: '1rem',
  radius3xl: '1.25rem',
  radiusFull: '9999px',

  // Shadows
  shadowXs: '0 1px 2px rgba(23, 32, 42, 0.04)',
  shadowSm: '0 1px 3px rgba(23, 32, 42, 0.06), 0 1px 2px rgba(23, 32, 42, 0.04)',
  shadowMd: '0 4px 6px rgba(23, 32, 42, 0.08), 0 2px 4px rgba(23, 32, 42, 0.06)',
  shadowLg: '0 8px 25px rgba(23, 32, 42, 0.1), 0 4px 12px rgba(23, 32, 42, 0.08)',
  shadowXl: '0 20px 40px rgba(23, 32, 42, 0.12), 0 8px 24px rgba(23, 32, 42, 0.1)',
  shadow2xl: '0 30px 60px rgba(23, 32, 42, 0.15), 0 12px 30px rgba(23, 32, 42, 0.12)',

  // Animation
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  durationFast: '150ms',
  durationNormal: '250ms',
  durationSlow: '400ms',
  durationSlower: '600ms',

  // Z-Index
  zDropdown: 50,
  zSticky: 100,
  zOverlay: 200,
  zModal: 300,
  zPopover: 400,
  zToast: 500,
  zTooltip: 600,
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
  --brand-green-light: ${brandTokens.primaryLight};
  --brand-green-pale: ${brandTokens.primaryPale};
  --brand-gold: ${brandTokens.accent};
  --brand-gold-dark: ${brandTokens.accentDark};
  --brand-gold-light: ${brandTokens.accentLight};
  --brand-gold-pale: ${brandTokens.accentPale};
}
` as const;

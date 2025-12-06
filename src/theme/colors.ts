/**
 * RealMeet Premium Color Palette
 * Sexy, Elegant, Premium Dating App Design
 * Inspired by Tinder x Bumble x Hinge Premium
 */

// ============================================
// PREMIUM COLOR PALETTE
// ============================================

export const colors = {
  // ─────────────────────────────────────────
  // BACKGROUND COLORS - Deep Luxurious Dark
  // ─────────────────────────────────────────
  background: {
    primary: '#0D0D12', // Rich dark charcoal
    secondary: '#161620', // Elevated surface
    tertiary: '#1E1E2A', // Card backgrounds
    elevated: '#252532', // Elevated cards/modals
    darker: '#08080C', // True dark
    // Premium gradient backgrounds
    gradient1: '#0D0D12',
    gradient2: '#1A1A26',
    gradient3: '#252532',
    cardBg: '#1A1A26',
  },

  // ─────────────────────────────────────────
  // TEXT COLORS - Crisp & Readable
  // ─────────────────────────────────────────
  text: {
    primary: '#FFFFFF', // Pure white - Headlines
    secondary: '#E4E4ED', // Soft white - Subheadings
    tertiary: '#9494A8', // Muted - Supporting text
    quaternary: '#6B6B80', // Very muted - Timestamps
    disabled: '#4A4A5C', // Disabled states
    inverse: '#0D0D12', // Dark text on light bg
  },

  // ─────────────────────────────────────────
  // BRAND COLORS - Romantic & Premium
  // ─────────────────────────────────────────
  brand: {
    // Primary - Romantic Rose/Coral
    primary: '#FF6B8A', // Vibrant rose
    primaryDark: '#E85577', // Deep rose
    primaryLight: '#FF8FA8', // Soft rose
    primaryMuted: '#FF6B8A40', // 25% opacity

    // Secondary - Warm Gold/Amber
    secondary: '#FFB347', // Warm amber
    secondaryDark: '#E89B2D', // Deep amber
    secondaryLight: '#FFC670', // Light amber

    // Accent - Electric Violet
    accent: '#A855F7', // Vibrant violet
    accentDark: '#9333EA', // Deep violet
    accentLight: '#C084FC', // Soft violet
    accentMuted: '#A855F720', // 12% opacity

    // Legacy purple (for backward compat)
    purple: '#A855F7',
    purpleDark: '#9333EA',
    purpleLight: '#C084FC',
    violet: '#A855F7',
    pink: '#FF6B8A',
    magenta: '#EC4899',
  },

  // ─────────────────────────────────────────
  // ACCENT/STATUS COLORS
  // ─────────────────────────────────────────
  accent: {
    // Success/Online - Vibrant Emerald
    green: '#10B981',
    greenLight: '#34D399',
    greenGlow: '#10B98180',

    // Warning
    amber: '#F59E0B',
    amberLight: '#FBBF24',

    // Error/Dislike
    red: '#EF4444',
    redLight: '#F87171',
    redGlow: '#EF444480',

    // Info
    cyan: '#06B6D4',
    cyanLight: '#22D3EE',

    // Like - Special gradient
    like: '#FF6B8A',
    superLike: '#3B82F6',

    // Links
    lightBlue: '#60A5FA',
    lightPurple: '#C084FC',
  },

  // ─────────────────────────────────────────
  // UI ELEMENT COLORS
  // ─────────────────────────────────────────
  ui: {
    // Borders
    border: '#2A2A3C', // Subtle border
    borderLight: '#3A3A4E', // Lighter border
    borderActive: '#FF6B8A', // Active/focused border
    borderDark: '#1E1E2A', // Dark border

    // Overlays & Glass
    overlay: 'rgba(255, 255, 255, 0.05)', // 5% white
    overlayLight: 'rgba(255, 255, 255, 0.08)', // 8% white
    overlayPressed: 'rgba(255, 255, 255, 0.12)', // 12% white
    overlayHover: 'rgba(255, 255, 255, 0.06)', // 6% white

    // Dark overlays
    overlayDark: 'rgba(0, 0, 0, 0.4)', // 40% black
    overlayDarker: 'rgba(0, 0, 0, 0.6)', // 60% black
    cardOverlay: 'rgba(0, 0, 0, 0.35)', // Card gradient overlay

    // Shadows
    shadow: 'rgba(0, 0, 0, 0.25)',
    shadowPrimary: 'rgba(255, 107, 138, 0.35)', // Rose shadow
    shadowAccent: 'rgba(168, 85, 247, 0.35)', // Violet shadow
    shadowGreen: 'rgba(16, 185, 129, 0.4)', // Green glow

    // Glass/Blur
    blur: 'rgba(13, 13, 18, 0.85)',
    blurLight: 'rgba(26, 26, 38, 0.75)',
    glass: 'rgba(255, 255, 255, 0.03)',
    glassStrong: 'rgba(255, 255, 255, 0.06)',

    // Dividers
    divider: 'rgba(255, 255, 255, 0.06)',
    dividerStrong: 'rgba(255, 255, 255, 0.1)',
  },

  // ─────────────────────────────────────────
  // GRADIENT DEFINITIONS
  // ─────────────────────────────────────────
  gradient: {
    // Primary button gradient (rose to coral)
    primary: ['#FF6B8A', '#FF8E72'],
    primaryReverse: ['#FF8E72', '#FF6B8A'],

    // Accent gradient (violet to pink)
    accent: ['#A855F7', '#EC4899'],
    accentReverse: ['#EC4899', '#A855F7'],

    // Premium gold gradient
    gold: ['#FFB347', '#FF8E53'],

    // Like button gradient
    like: ['#FF6B8A', '#FF8FA8'],

    // Super like gradient
    superLike: ['#3B82F6', '#60A5FA'],

    // Skip/Dislike gradient
    dislike: ['#6B7280', '#9CA3AF'],

    // Dark gradients for backgrounds
    dark: ['#0D0D12', '#161620', '#1E1E2A'],
    darkReverse: ['#1E1E2A', '#161620', '#0D0D12'],

    // Card overlay gradient (for profile cards)
    cardOverlay: [
      'rgba(0, 0, 0, 0)',
      'rgba(0, 0, 0, 0.3)',
      'rgba(0, 0, 0, 0.7)',
    ],

    // Premium shimmer
    shimmer: ['#1E1E2A', '#252532', '#1E1E2A'],

    // Glass effect
    glass: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'],

    // Legacy
    purple: ['#A855F7', '#EC4899', '#FF6B8A'],
    card: ['#1E1E2A', '#252532'],
  },

  // Transparent
  transparent: 'transparent',
};

// ============================================
// SHADOW PRESETS
// ============================================

export const shadows = {
  // Soft shadows
  sm: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  lg: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  xl: {
    shadowColor: colors.ui.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },

  // Colored glow shadows
  primaryGlow: {
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  accentGlow: {
    shadowColor: colors.brand.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  greenGlow: {
    shadowColor: colors.accent.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },

  redGlow: {
    shadowColor: colors.accent.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  // Card shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 14,
  },
};

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  // Specific components
  button: 16,
  buttonPill: 9999,
  input: 14,
  card: 20,
  cardLarge: 28,
  avatar: 9999,
  badge: 8,
  tag: 12,
  modal: 24,
};

// ============================================
// SPACING TOKENS
// ============================================

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
};

// ============================================
// TYPOGRAPHY SCALE
// ============================================

export const typography = {
  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Font weights
  weight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Letter spacing
  tracking: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

// ============================================
// OPACITY TOKENS
// ============================================

export const opacity = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
};

// ============================================
// ANIMATION TOKENS
// ============================================

export const animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ============================================
// ICON STYLE GUIDELINES
// ============================================

export const iconStyle = {
  // Sizes
  size: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
    '2xl': 40,
  },

  // Default stroke width for outlined icons
  strokeWidth: 1.8,

  // Default colors
  defaultColor: colors.text.secondary,
  activeColor: colors.brand.primary,
  mutedColor: colors.text.quaternary,
};

// Type exports
export type Colors = typeof colors;
export type Shadows = typeof shadows;
export type BorderRadius = typeof borderRadius;
export type Spacing = typeof spacing;
export type Typography = typeof typography;

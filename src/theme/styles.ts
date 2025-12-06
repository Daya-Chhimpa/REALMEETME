/**
 * RealMeet Premium Style Utilities
 * Reusable style patterns for premium UI components
 */

import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors, shadows, borderRadius, spacing, typography} from './colors';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// ============================================
// GLASSMORPHISM STYLES
// ============================================

export const glass = StyleSheet.create({
  // Light glass effect
  light: {
    backgroundColor: colors.ui.glass,
    borderWidth: 1,
    borderColor: colors.ui.divider,
  },

  // Strong glass effect
  strong: {
    backgroundColor: colors.ui.glassStrong,
    borderWidth: 1,
    borderColor: colors.ui.dividerStrong,
  },

  // Card glass effect
  card: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: borderRadius.card,
    ...shadows.card,
  },

  // Elevated glass card
  cardElevated: {
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.ui.borderLight,
    borderRadius: borderRadius.cardLarge,
    ...shadows.lg,
  },

  // Modal glass
  modal: {
    backgroundColor: colors.ui.blur,
    borderWidth: 1,
    borderColor: colors.ui.divider,
    borderRadius: borderRadius.modal,
  },
});

// ============================================
// CARD STYLES
// ============================================

export const cards = StyleSheet.create({
  // Base card
  base: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.card,
    padding: spacing[4],
    ...shadows.md,
  },

  // Profile card
  profile: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.cardLarge,
    overflow: 'hidden',
    ...shadows.xl,
  },

  // Message card
  message: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },

  // Selection card (for options)
  selection: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.ui.border,
    padding: spacing[4],
  },

  // Selection card active
  selectionActive: {
    backgroundColor: colors.brand.primaryMuted,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    padding: spacing[4],
  },
});

// ============================================
// BUTTON STYLES
// ============================================

export const buttons = StyleSheet.create({
  // Primary button base
  primary: {
    height: 56,
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    backgroundColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },

  // Primary button text
  primaryText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
  },

  // Secondary button (outline)
  secondary: {
    height: 56,
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
  },

  // Secondary button text
  secondaryText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
  },

  // Ghost button
  ghost: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    backgroundColor: colors.transparent,
  },

  // Ghost button text
  ghostText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },

  // Icon button
  icon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ui.overlay,
  },

  // Icon button with glow
  iconGlow: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },

  // Pill button
  pill: {
    height: 44,
    borderRadius: borderRadius.buttonPill,
    paddingHorizontal: spacing[5],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },

  // Pill button text
  pillText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },

  // Action button (like/skip)
  actionLike: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },

  actionSkip: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },
});

// ============================================
// INPUT STYLES
// ============================================

export const inputs = StyleSheet.create({
  // Container
  container: {
    marginBottom: spacing[5],
  },

  // Label
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    letterSpacing: typography.tracking.wide,
  },

  // Input wrapper
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.input,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing[4],
    minHeight: 56,
  },

  // Input wrapper focused
  wrapperFocused: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.secondary,
  },

  // Input wrapper error
  wrapperError: {
    borderColor: colors.accent.red,
  },

  // Input field
  field: {
    flex: 1,
    height: 56,
    fontSize: typography.size.md,
    color: colors.text.primary,
    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
  },

  // Left icon
  leftIcon: {
    marginRight: spacing[3],
  },

  // Right icon
  rightIcon: {
    marginLeft: spacing[3],
  },

  // Error text
  error: {
    fontSize: typography.size.xs,
    color: colors.accent.red,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },

  // Helper text
  helper: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

// ============================================
// BADGE STYLES
// ============================================

export const badges = StyleSheet.create({
  // Online indicator
  online: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent.green,
    borderWidth: 2.5,
    borderColor: colors.background.primary,
    ...shadows.greenGlow,
  },

  // Online indicator large
  onlineLarge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent.green,
    borderWidth: 3,
    borderColor: colors.background.primary,
    ...shadows.greenGlow,
  },

  // Verified badge
  verified: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  // Premium badge
  premium: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.badge,
    backgroundColor: colors.brand.secondary,
    ...shadows.sm,
  },

  // Premium badge text
  premiumText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    letterSpacing: typography.tracking.wider,
  },

  // Count badge
  count: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
  },

  // Count badge text
  countText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Unread dot
  unread: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.primary,
    ...shadows.sm,
  },

  // Location badge
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.overlayLight,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
    gap: 4,
  },

  // Location badge text
  locationText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
});

// ============================================
// AVATAR STYLES
// ============================================

export const avatars = StyleSheet.create({
  // Small avatar
  sm: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
  },

  // Medium avatar
  md: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.tertiary,
  },

  // Large avatar
  lg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background.tertiary,
  },

  // Extra large avatar
  xl: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background.tertiary,
  },

  // Avatar with border
  bordered: {
    borderWidth: 3,
    borderColor: colors.brand.primary,
  },

  // Avatar with glow
  glow: {
    borderWidth: 3,
    borderColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },
});

// ============================================
// HEADER STYLES
// ============================================

export const headers = StyleSheet.create({
  // Container
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },

  // With border
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },

  // Title
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Subtitle
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },

  // Icon button
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ui.overlay,
  },
});

// ============================================
// PROFILE CARD OVERLAY STYLES
// ============================================

export const profileCard = StyleSheet.create({
  // Container
  container: {
    borderRadius: borderRadius.cardLarge,
    overflow: 'hidden',
    ...shadows.xl,
  },

  // Image
  image: {
    width: '100%',
    height: SCREEN_WIDTH * 1.25,
  },

  // Overlay gradient (use with LinearGradient)
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },

  // Info container
  info: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing[5],
  },

  // Name
  name: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },

  // Age
  age: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.normal,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },

  // Bio
  bio: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    marginTop: spacing[2],
  },
});

// ============================================
// MESSAGE LIST STYLES
// ============================================

export const messageList = StyleSheet.create({
  // Item container
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },

  // With divider
  itemWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },

  // Avatar container
  avatarContainer: {
    position: 'relative',
    marginRight: spacing[4],
  },

  // Content
  content: {
    flex: 1,
  },

  // Header row
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },

  // Name
  name: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  // Time
  time: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
  },

  // Message preview
  preview: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },

  // Unread message preview
  previewUnread: {
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
});

// ============================================
// SIDEBAR STYLES
// ============================================

export const sidebar = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Profile section
  profileSection: {
    paddingTop: 60,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },

  // Profile image
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.brand.primary,
    marginBottom: spacing[3],
    ...shadows.primaryGlow,
  },

  // Profile name
  profileName: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Menu container
  menuContainer: {
    flex: 1,
    paddingTop: spacing[4],
  },

  // Menu item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    marginHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
  },

  // Menu item active
  menuItemActive: {
    backgroundColor: colors.brand.primaryMuted,
  },

  // Menu icon container
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },

  // Menu icon container active
  menuIconContainerActive: {
    backgroundColor: colors.brand.primary,
  },

  // Menu text
  menuText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
});

// ============================================
// LAYOUT UTILITIES
// ============================================

export const layout = StyleSheet.create({
  // Screen container
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Safe area
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Centered content
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Row with space between
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Full width
  fullWidth: {
    width: '100%',
  },

  // Padding horizontal
  paddingX: {
    paddingHorizontal: spacing[6],
  },

  // Padding vertical
  paddingY: {
    paddingVertical: spacing[4],
  },

  // Scroll content
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
});

// ============================================
// SCREEN DIMENSIONS
// ============================================

export const dimensions = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  card: {
    width: SCREEN_WIDTH - spacing[8],
    height: (SCREEN_WIDTH - spacing[8]) * 1.25,
  },
  avatar: {
    sm: 40,
    md: 56,
    lg: 72,
    xl: 96,
  },
};

// ============================================
// GRADIENT CONFIGS (for react-native-linear-gradient)
// ============================================

export const gradientConfigs = {
  primaryButton: {
    colors: colors.gradient.primary,
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
  },
  accentButton: {
    colors: colors.gradient.accent,
    start: {x: 0, y: 0},
    end: {x: 1, y: 1},
  },
  cardOverlay: {
    colors: colors.gradient.cardOverlay,
    start: {x: 0, y: 0},
    end: {x: 0, y: 1},
  },
  darkBackground: {
    colors: colors.gradient.dark,
    start: {x: 0, y: 0},
    end: {x: 0, y: 1},
  },
};

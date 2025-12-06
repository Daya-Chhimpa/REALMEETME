import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography} from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const sizeStyles = {
    sm: styles.buttonSm,
    md: styles.buttonMd,
    lg: styles.buttonLg,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  };

  const buttonContent = (
    <View style={styles.contentWrapper}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary || isDanger ? colors.text.primary : colors.text.secondary}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.buttonText,
              textSizeStyles[size],
              isPrimary && styles.primaryText,
              isSecondary && styles.secondaryText,
              isGhost && styles.ghostText,
              isDanger && styles.dangerText,
              disabled && styles.disabledText,
              textStyle,
            ]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  // Primary button with gradient
  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}>
        <LinearGradient
          colors={colors.gradient.primary as [string, string]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            styles.button,
            sizeStyles[size],
            styles.primaryButton,
            fullWidth && styles.fullWidth,
          ]}>
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Danger button with gradient
  if (isDanger && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && styles.fullWidth, style]}>
        <LinearGradient
          colors={['#EF4444', '#F87171'] as [string, string]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            styles.button,
            sizeStyles[size],
            styles.dangerButton,
            fullWidth && styles.fullWidth,
          ]}>
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        isSecondary && styles.secondaryButton,
        isGhost && styles.ghostButton,
        (isPrimary || isDanger) && disabled && styles.disabledPrimaryButton,
        isSecondary && disabled && styles.disabledSecondaryButton,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button
  button: {
    borderRadius: borderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden',
  },

  // Size variants
  buttonSm: {
    height: 44,
    paddingHorizontal: 20,
  },
  buttonMd: {
    height: 52,
    paddingHorizontal: 24,
  },
  buttonLg: {
    height: 58,
    paddingHorizontal: 28,
  },

  // Primary button (gradient applied via LinearGradient)
  primaryButton: {
    ...shadows.primaryGlow,
  },

  // Secondary button (outline style)
  secondaryButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.ui.borderLight,
  },

  // Ghost button (no background)
  ghostButton: {
    backgroundColor: colors.transparent,
    paddingHorizontal: 16,
  },

  // Danger button
  dangerButton: {
    ...shadows.redGlow,
  },

  // Disabled states
  disabledPrimaryButton: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.6,
  },
  disabledSecondaryButton: {
    borderColor: colors.ui.border,
    opacity: 0.5,
  },

  // Content wrapper
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon wrappers
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },

  // Base text
  buttonText: {
    fontWeight: typography.weight.bold,
    letterSpacing: typography.tracking.wide,
    textTransform: 'uppercase',
  },

  // Text sizes
  textSm: {
    fontSize: typography.size.sm,
  },
  textMd: {
    fontSize: typography.size.base,
  },
  textLg: {
    fontSize: typography.size.md,
  },

  // Text colors
  primaryText: {
    color: colors.text.primary,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  ghostText: {
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },
  dangerText: {
    color: colors.text.primary,
  },
  disabledText: {
    color: colors.text.disabled,
  },

  // Full width
  fullWidth: {
    width: '100%',
  },
});

// ============================================
// ICON BUTTON COMPONENT
// ============================================

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
}) => {
  const sizeValues = {
    sm: 40,
    md: 52,
    lg: 64,
  };

  const buttonSize = sizeValues[size];

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'primary':
        return iconButtonStyles.primary;
      case 'danger':
        return iconButtonStyles.danger;
      case 'success':
        return iconButtonStyles.success;
      default:
        return iconButtonStyles.default;
    }
  };

  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        style={style}>
        <LinearGradient
          colors={colors.gradient.primary as [string, string]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            iconButtonStyles.base,
            {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
            iconButtonStyles.primary,
          ]}>
          {icon}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        iconButtonStyles.base,
        {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
        getBackgroundStyle(),
        disabled && iconButtonStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      {icon}
    </TouchableOpacity>
  );
};

const iconButtonStyles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  default: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
  },
  primary: {
    ...shadows.primaryGlow,
  },
  danger: {
    backgroundColor: colors.accent.red,
    ...shadows.redGlow,
  },
  success: {
    backgroundColor: colors.accent.green,
    ...shadows.greenGlow,
  },
  disabled: {
    opacity: 0.5,
  },
});

// ============================================
// ACTION BUTTON (FOR LIKE/SKIP)
// ============================================

interface ActionButtonProps {
  type: 'like' | 'skip' | 'superlike' | 'boost';
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onPress,
  size = 'md',
  disabled = false,
  style,
}) => {
  const sizeValues = {
    sm: 52,
    md: 64,
    lg: 76,
  };

  const iconSizes = {
    sm: 22,
    md: 26,
    lg: 32,
  };

  const buttonSize = sizeValues[size];
  const iconSize = iconSizes[size];

  const getIcon = () => {
    switch (type) {
      case 'like':
        return <Text style={{fontSize: iconSize}}>❤️</Text>;
      case 'skip':
        return <Text style={{fontSize: iconSize, color: colors.text.tertiary}}>✕</Text>;
      case 'superlike':
        return <Text style={{fontSize: iconSize}}>⭐</Text>;
      case 'boost':
        return <Text style={{fontSize: iconSize}}>⚡</Text>;
    }
  };

  const getGradient = (): [string, string] => {
    switch (type) {
      case 'like':
        return colors.gradient.like as [string, string];
      case 'superlike':
        return colors.gradient.superLike as [string, string];
      case 'boost':
        return colors.gradient.gold as [string, string];
      default:
        return [colors.background.tertiary, colors.background.elevated];
    }
  };

  const getShadow = () => {
    switch (type) {
      case 'like':
        return shadows.primaryGlow;
      case 'superlike':
        return shadows.accentGlow;
      case 'boost':
        return shadows.lg;
      default:
        return shadows.md;
    }
  };

  if (type === 'skip') {
    return (
      <TouchableOpacity
        style={[
          actionButtonStyles.base,
          {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
          actionButtonStyles.skip,
          disabled && actionButtonStyles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}>
        {getIcon()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[disabled && actionButtonStyles.disabled, style]}>
      <LinearGradient
        colors={getGradient()}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          actionButtonStyles.base,
          {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
          getShadow(),
        ]}>
        {getIcon()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const actionButtonStyles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skip: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
    ...shadows.md,
  },
  disabled: {
    opacity: 0.5,
  },
});

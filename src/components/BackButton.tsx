import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';

interface BackButtonProps {
  onPress: () => void;
  variant?: 'default' | 'light' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 52;
      default:
        return 44;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 26;
      default:
        return 22;
    }
  };

  const buttonSize = getSize();
  const fontSize = getFontSize();

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.buttonWrapper, style]}>
        <LinearGradient
          colors={colors.gradient.primary as [string, string]}
          style={[
            styles.gradientButton,
            {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
          ]}>
          <Text style={[styles.icon, {fontSize}]}>←</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        variant === 'light' && styles.buttonLight,
        {width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2},
        style,
      ]}>
      <Text
        style={[
          styles.icon,
          variant === 'light' && styles.iconLight,
          {fontSize},
        ]}>
        ←
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    ...shadows.sm,
  },
  button: {
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    ...shadows.sm,
  },
  buttonLight: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.ui.borderLight,
  },
  gradientButton: {
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  icon: {
    color: colors.text.primary,
    fontWeight: typography.weight.semibold,
  },
  iconLight: {
    color: colors.text.secondary,
  },
});

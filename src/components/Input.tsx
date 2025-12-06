import React, {forwardRef, useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  Platform,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, borderRadius, typography, shadows, spacing} from '../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      onRightIconPress,
      variant = 'default',
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getContainerStyle = (): ViewStyle[] => {
      const baseStyles: ViewStyle[] = [styles.inputContainer];

      if (variant === 'filled') {
        baseStyles.push(styles.inputContainerFilled);
        if (isFocused) baseStyles.push(styles.inputContainerFocused);
      } else if (variant === 'outlined') {
        baseStyles.push(styles.inputContainerOutlined);
        if (isFocused) baseStyles.push(styles.inputContainerFocusedOutlined);
      } else {
        if (isFocused) baseStyles.push(styles.inputContainerFocused);
      }

      if (error) baseStyles.push(styles.inputContainerError);

      return baseStyles;
    };

    const getInputStyle = (): TextStyle[] => {
      const inputStyles: TextStyle[] = [styles.input];
      if (leftIcon) inputStyles.push(styles.inputWithLeftIcon);
      if (rightIcon) inputStyles.push(styles.inputWithRightIcon);
      if (style) inputStyles.push(style as TextStyle);
      return inputStyles;
    };

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, isFocused ? styles.labelFocused : null]}>
            {label}
          </Text>
        )}
        <View style={getContainerStyle()}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={getInputStyle()}
            placeholderTextColor={colors.text.quaternary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectionColor={colors.brand.primary}
            {...props}
          />
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {helper && !error ? <Text style={styles.helperText}>{helper}</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    letterSpacing: typography.tracking.wide,
  },
  labelFocused: {
    color: colors.brand.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.input,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing[4],
    minHeight: 56,
  },
  inputContainerFilled: {
    backgroundColor: colors.background.elevated,
    borderColor: colors.transparent,
  },
  inputContainerOutlined: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
  },
  inputContainerFocused: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.secondary,
    ...shadows.sm,
  },
  inputContainerFocusedOutlined: {
    borderColor: colors.brand.primary,
  },
  inputContainerError: {
    borderColor: colors.accent.red,
  },
  leftIcon: {
    marginRight: spacing[3],
  },
  rightIcon: {
    marginLeft: spacing[3],
    padding: spacing[1],
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: typography.size.md,
    color: colors.text.primary,
    paddingVertical: Platform.OS === 'ios' ? spacing[3] : spacing[2],
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.accent.red,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
  helperText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

// ============================================
// OTP INPUT COMPONENT
// ============================================

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  error,
}) => {
  const inputRefs = React.useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    const joined = newValue.join('').slice(0, length);
    onChange(joined);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getWrapperStyle = (index: number): ViewStyle[] => {
    const wrapperStyles: ViewStyle[] = [otpStyles.inputWrapper];
    if (focusedIndex === index) wrapperStyles.push(otpStyles.inputWrapperFocused);
    if (value[index]) wrapperStyles.push(otpStyles.inputWrapperFilled);
    if (error) wrapperStyles.push(otpStyles.inputWrapperError);
    return wrapperStyles;
  };

  return (
    <View style={otpStyles.container}>
      <View style={otpStyles.inputsContainer}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={getWrapperStyle(index)}>
              <TextInput
                ref={el => (inputRefs.current[index] = el)}
                style={otpStyles.input}
                maxLength={1}
                keyboardType="number-pad"
                value={value[index] || ''}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                selectionColor={colors.brand.primary}
              />
            </View>
          ))}
      </View>
      {error ? <Text style={otpStyles.errorText}>{error}</Text> : null}
    </View>
  );
};

const otpStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
  },
  inputWrapper: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.secondary,
    ...shadows.sm,
  },
  inputWrapperFilled: {
    borderColor: colors.brand.primaryLight,
    backgroundColor: colors.brand.primaryMuted,
  },
  inputWrapperError: {
    borderColor: colors.accent.red,
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.accent.red,
    marginTop: spacing[3],
    textAlign: 'center',
  },
});

// ============================================
// SEARCH INPUT COMPONENT
// ============================================

interface SearchInputProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  value,
  ...props
}) => {
  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.iconContainer}>
        <Text style={searchStyles.searchIcon}>🔍</Text>
      </View>
      <TextInput
        style={searchStyles.input}
        placeholderTextColor={colors.text.quaternary}
        placeholder="Search..."
        value={value}
        {...props}
      />
      {value && onClear ? (
        <TouchableOpacity style={searchStyles.clearButton} onPress={onClear}>
          <Text style={searchStyles.clearIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.buttonPill,
    paddingHorizontal: spacing[4],
    height: 48,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  iconContainer: {
    marginRight: spacing[3],
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  clearButton: {
    padding: spacing[2],
    marginLeft: spacing[2],
  },
  clearIcon: {
    fontSize: 14,
    color: colors.text.quaternary,
  },
});

// ============================================
// PHONE INPUT COMPONENT
// ============================================

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  countryCode?: string;
  value: string;
  onChangeText: (value: string) => void;
  onCountryPress?: () => void;
  error?: string;
  label?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode = '+91',
  value,
  onChangeText,
  onCountryPress,
  error,
  label,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getWrapperStyle = (): ViewStyle[] => {
    const wrapperStyles: ViewStyle[] = [phoneStyles.inputWrapper];
    if (isFocused) wrapperStyles.push(phoneStyles.inputWrapperFocused);
    if (error) wrapperStyles.push(phoneStyles.inputWrapperError);
    return wrapperStyles;
  };

  return (
    <View style={phoneStyles.container}>
      {label ? <Text style={phoneStyles.label}>{label}</Text> : null}
      <View style={getWrapperStyle()}>
        <TouchableOpacity
          style={phoneStyles.countryButton}
          onPress={onCountryPress}>
          <Text style={phoneStyles.flag}>🇮🇳</Text>
          <Text style={phoneStyles.countryCode}>{countryCode}</Text>
          <Text style={phoneStyles.chevron}>▼</Text>
        </TouchableOpacity>
        <View style={phoneStyles.divider} />
        <TextInput
          style={phoneStyles.input}
          keyboardType="phone-pad"
          placeholder="Mobile Number"
          placeholderTextColor={colors.text.quaternary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={10}
          {...props}
        />
      </View>
      {error ? <Text style={phoneStyles.errorText}>{error}</Text> : null}
    </View>
  );
};

const phoneStyles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    letterSpacing: typography.tracking.wide,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.input,
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    height: 56,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.secondary,
  },
  inputWrapperError: {
    borderColor: colors.accent.red,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    height: '100%',
    gap: spacing[2],
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  chevron: {
    fontSize: 10,
    color: colors.text.quaternary,
    marginLeft: spacing[1],
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.ui.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing[4],
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },
  errorText: {
    fontSize: typography.size.xs,
    color: colors.accent.red,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

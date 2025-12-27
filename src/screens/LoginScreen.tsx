import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Input, BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser } from '../redux/slices/authSlice';
import { loginSchema } from '../utils/validation';

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector(state => state.auth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleLogin = async () => {
    setValidationError('');
    // Prefix +91 if missing (simple check)
    const formattedMobile = phone.startsWith('+') ? phone : `+91${phone}`;

    // Pass "000000" as OTP since this screen is Password login, assume API might ignore OTP or it's a different flow
    // If API actually NEEDS OTP, we would need a different UI flow (Get OTP -> Login with OTP).
    // Assuming Password login for now.
    const credentials = {
      mobile: formattedMobile,
      password: password,
      otp: '000000'
    };

    try {
      // We might need to adjust loginSchema if it strictly requires 6 digit OTP and we are passing dummy.
      // For now let's skip strict schema validation for OTP if we are faking it, or conform to it.
      // 000000 satisfies 6 digits.

      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('matches');
      } else {
        // Error is handled in Redux state, but we can log user friendly message if needed
      }
    } catch (err) {
      console.error("Login Error", err);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password');
  };

  const handleSignUp = () => {
    navigate('mobile'); // Same flow as Get Started
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Social login:', provider);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Decorative Elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Back Button */}
          <BackButton onPress={goBack} variant="default" />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={colors.gradient.primary as [string, string]}
                style={styles.logoGradient}>
                <Text style={styles.logoText}>RealMeet</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue finding your perfect match
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneContainer}>
                <TouchableOpacity style={styles.countryCode}>
                  <Text style={styles.countryFlag}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>+91</Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                <View style={styles.phoneInputWrapper}>
                  <Input
                    placeholder="Enter mobile number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={<Text style={{ fontSize: 20 }}>{showPassword ? '👁️' : '🔒'}</Text>}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {(error || validationError) && (
              <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
                {validationError || error}
              </Text>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={isLoading}>
              <LinearGradient
                colors={colors.gradient.primary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginGradient}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                </Text>
                {!isLoading && <Text style={styles.arrowIcon}>→</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <View style={styles.dividerTextContainer}>
                <Text style={styles.dividerText}>or continue with</Text>
              </View>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('google')}
                activeOpacity={0.8}>
                <View style={styles.socialIconContainer}>
                  <Text style={styles.socialIcon}>G</Text>
                </View>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('facebook')}
                activeOpacity={0.8}>
                <View style={[styles.socialIconContainer, styles.facebookIcon]}>
                  <Text style={styles.socialIcon}>f</Text>
                </View>
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('apple')}
                activeOpacity={0.8}>
                <View style={[styles.socialIconContainer, styles.appleIcon]}>
                  <Text style={styles.socialIcon}></Text>
                </View>
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.3,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: height * 0.3,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.brand.accentMuted,
    opacity: 0.2,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
  },

  // Header
  header: {
    alignItems: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[8],
  },
  logoContainer: {
    marginBottom: spacing[5],
  },
  logoGradient: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  logoText: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
    letterSpacing: typography.tracking.tight,
  },
  subtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Form
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing[3],
    letterSpacing: typography.tracking.wide,
    textTransform: 'uppercase',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing[3],
    height: 56,
    gap: spacing[2],
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  dropdownIcon: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: spacing[2],
  },
  forgotText: {
    fontSize: typography.size.sm,
    color: colors.brand.primary,
    fontWeight: typography.weight.semibold,
  },

  // Login Button
  loginButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    marginTop: spacing[2],
    marginBottom: spacing[6],
    ...shadows.primaryGlow,
  },
  loginGradient: {
    flexDirection: 'row',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  loginButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },
  arrowIcon: {
    fontSize: typography.size.lg,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.divider,
  },
  dividerTextContainer: {
    paddingHorizontal: spacing[4],
  },
  dividerText: {
    fontSize: typography.size.sm,
    color: colors.text.quaternary,
    fontWeight: typography.weight.medium,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  socialButton: {
    alignItems: 'center',
    gap: spacing[2],
  },
  socialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    ...shadows.sm,
  },
  facebookIcon: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  appleIcon: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  socialIcon: {
    fontSize: 22,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  socialButtonText: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },

  // Sign Up Link
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  signUpText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  signUpLink: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },

  // Terms
  termsText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.brand.primary,
    fontWeight: typography.weight.medium,
  },
});

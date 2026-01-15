import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { colors } from '../theme/colors';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { verifyOtp, saveDraft, sendOtp } from '../redux/slices/authSlice';
import { verifyOtpSchema } from '../utils/validation';

export const OTPVerificationScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft, isLoading, error } = useAppSelector(state => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const phoneNumber = registrationDraft?.mobile || '';

  // Timer logic
  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = () => {
    console.log('Change number');
    goBack();
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      await dispatch(sendOtp(phoneNumber));
    }
  };

  const handleContinue = async () => {
    const otpCode = otp.join('');
    try {
      await verifyOtpSchema.validate({ mobile: phoneNumber, otp: otpCode });

      const resultAction = await dispatch(verifyOtp({ mobile: phoneNumber, otp: otpCode }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        // Assuming verification is successful, we save the OTP (or just the fact it is verified)
        // Usually we don't save OTP itself, but for now lets proceed.
        // We'll proceed to the next step.
        dispatch(saveDraft({ otpVerified: true })); // You might need to add otpVerified to RegistrationData if not there, or rely on Redux state
        navigate('name');
      }
    } catch (err: any) {
      // handle error
      console.log("Validation error", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            Please enter the verification code sent to {phoneNumber}
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChange}
            activeOpacity={0.7}>
            <Text style={styles.actionButtonText}>CHANGE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              resendTimer === 0 && { borderColor: colors.brand.primary, backgroundColor: 'rgba(255, 107, 138, 0.1)' },
              resendTimer > 0 && styles.disabledButton
            ]}
            onPress={handleResend}
            activeOpacity={0.7}
            disabled={resendTimer > 0}>
            <Text style={[
              styles.actionButtonText,
              resendTimer === 0 && { color: colors.brand.primary, fontWeight: '700' },
              resendTimer > 0 && styles.disabledButtonText
            ]}>
              {resendTimer > 0 ? `RESEND (${resendTimer})` : 'RESEND'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Success Message / Error Message */}
        {error ? (
          <View style={[styles.successContainer, { backgroundColor: '#ffebee' }]}>
            <Text style={[styles.successText, { color: '#c62828' }]}>{error}</Text>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Successfully sent OTP to {phoneNumber}
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={isLoading}>
          <Text style={styles.continueButtonText}>{isLoading ? 'VERIFYING...' : 'CONTINUE'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: Math.min(32, SCREEN_WIDTH * 0.08),
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: SCREEN_WIDTH * 0.02,
  },
  otpInput: {
    flex: 1,
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.ui.borderLight,
    fontSize: Math.min(24, SCREEN_WIDTH * 0.06),
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.ui.borderLight,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  successContainer: {
    backgroundColor: colors.accent.green,
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: colors.brand.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
  disabledButton: {
    borderColor: colors.ui.border,
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
  },
  disabledButtonText: {
    color: colors.text.tertiary,
    opacity: 0.5,
  },
});

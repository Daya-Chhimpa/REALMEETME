import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Input, BackButton, Toast } from '../components';
import { ToastType } from '../components/Toast';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { sendOtp, saveDraft, loadRegistrationDraft } from '../redux/slices/authSlice';
import { sendOtpSchema } from '../utils/validation';

export const MobileNumberScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft, isLoading, error } = useAppSelector(state => state.auth);

  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const showToast = (msg: string, type: ToastType) => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  // Load draft on mount
  React.useEffect(() => {
    dispatch(loadRegistrationDraft());
  }, [dispatch]);

  // Set phone from draft if available
  React.useEffect(() => {
    if (registrationDraft?.mobile) {
      setPhone(registrationDraft.mobile);
    }
  }, [registrationDraft]);

  const handleNext = async () => {
    setValidationError('');
    try {
      await sendOtpSchema.validate({ mobile: phone });

      const mobileWithCode = `+91${phone}`;
      const resultAction = await dispatch(sendOtp(mobileWithCode));

      if (sendOtp.fulfilled.match(resultAction)) {
        showToast('OTP code sent successfully!', 'success');
        dispatch(saveDraft({ mobile: mobileWithCode }));
        // Delay navigation slightly so user sees the toast ? 
        // Or just navigate. User wanted Toast on success.
        // If we navigate immediately, the new screen covers this one. 
        // But the previous screen is still there. 
        // Let's assume user accepts immediate nav or valid behavior.
        setTimeout(() => navigate('otp'), 500);
      } else if (sendOtp.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string || 'Failed to send OTP';
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        setValidationError(err.message);
        showToast(err.message, 'error');
      } else {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" style={{ marginRight: spacing[3] }} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>What's your mobile number?</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.phoneInputWrapper}>
              <Input
                placeholder="Mobile number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
          </View>


          {/* {validationError ? <Text style={{ color: 'red', marginTop: 5 }}>{validationError}</Text> : null}
          {error && !validationError ? <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text> : null} */}

          <Text style={styles.changeLink}>Not in India? Change</Text>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, phone.length !== 10 && styles.nextButtonDisabled]}
          onPress={() => {
            if (phone.length === 10) handleNext();
          }}
          disabled={phone.length !== 10}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              phone.length === 10
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.borderDark, colors.ui.borderDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>{isLoading ? 'SENDING...' : 'NEXT'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View >
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView >
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
    justifyContent: 'space-between',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: Math.min(28, SCREEN_WIDTH * 0.07),
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  formContainer: {
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  countryCode: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ui.borderDark,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 70,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  changeLink: {
    fontSize: 14,
    color: colors.accent.lightBlue,
    textAlign: 'right',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  nextButtonGradient: {
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
});

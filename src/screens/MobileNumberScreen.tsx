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
  Animated,
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

// Custom decorative icon
const PhoneDecor: React.FC = () => (
  <View style={styles.decorContainer}>
    <Text style={styles.decorIcon}>📱</Text>
  </View>
);

export const MobileNumberScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft, isLoading } = useAppSelector(state => state.auth);

  const [phone, setPhone] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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
      setPhone(registrationDraft.mobile.replace('+91', ''));
    }
  }, [registrationDraft]);

  const handleNext = async () => {
    try {
      if (phone.length !== 10) return;

      const mobileWithCode = `+91${phone}`;
      const resultAction = await dispatch(sendOtp(mobileWithCode));

      if (sendOtp.fulfilled.match(resultAction)) {
        showToast('OTP sent successfully!', 'success');
        dispatch(saveDraft({ mobile: mobileWithCode }));
        setTimeout(() => navigate('otp'), 500);
      } else if (sendOtp.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string || 'Failed to send OTP';
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      showToast('An unexpected error occurred', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.gradientBackground}
      />

      <PhoneDecor />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" />
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>1 / 9</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Let's get started 🚀</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to create an account or log in.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryFlag}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.phoneInputWrapper}>
              <Input
                placeholder="Mobile Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
          </View>
          <Text style={styles.changeLink}>We will send you a verification code.</Text>
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
                : [colors.ui.border, colors.ui.border]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>{isLoading ? 'SENDING...' : 'CONTINUE'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
  },
  decorContainer: {
    position: 'absolute',
    top: '10%',
    right: -20,
    opacity: 0.1,
    transform: [{ rotate: '15deg' }, { scale: 1.5 }],
    zIndex: 0,
  },
  decorIcon: {
    fontSize: 180,
    color: colors.brand.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    justifyContent: 'space-between',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBadge: {
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.tertiary,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 60,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  countryCode: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 90,
    flexDirection: 'row',
    gap: 8,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCodeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  changeLink: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  nextButton: {
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  nextButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: colors.ui.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 2,
  },
});

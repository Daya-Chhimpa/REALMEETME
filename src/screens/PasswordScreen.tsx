import React, { useState, useRef, useEffect } from 'react';
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
import { colors, shadows, borderRadius, spacing } from '../theme/colors';
import { Input } from '../components/Input';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/slices/authSlice';
import { registerSchema } from '../utils/validation';
import { Toast, ToastType } from '../components/Toast';
import { BackButton } from '../components';
import { EyeIcon, EyeOffIcon } from '../components/icons';

// Decorative background icon
const PasswordDecor: React.FC = () => (
  <View style={styles.decorContainer}>
    <Text style={styles.decorIcon}>🔒</Text>
  </View>
);

export const PasswordScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft, isLoading, error } = useAppSelector(state => state.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleNext = async () => {
    if (password === confirmPassword) {
      if (!registrationDraft.mobile) {
        setToast({ visible: true, message: 'Missing mobile number', type: 'error' });
        return;
      }

      // Collect Data
      const formattedGender = registrationDraft.gender
        ? registrationDraft.gender.charAt(0).toUpperCase() + registrationDraft.gender.slice(1)
        : 'Male';

      const finalData = {
        mobile: registrationDraft?.mobile,
        name: registrationDraft?.name || 'User',
        password: password,
        gender: formattedGender,
        dob: registrationDraft?.dob || '2000-01-01',
        images: registrationDraft?.images || [],
        interests: registrationDraft?.interests,
        address: registrationDraft?.address,
        lookingFor: registrationDraft?.lookingFor,
        maritalStatus: registrationDraft?.relationshipStatus,
      };

      try {
        await registerSchema.validate(finalData);
        // Dispatch Register
        const resultAction = await dispatch(registerUser(finalData));
        if (registerUser.fulfilled.match(resultAction)) {
          setToast({ visible: true, message: 'Registration successful!', type: 'success' });
        } else {
          if (registerUser.rejected.match(resultAction)) {
            setToast({
              visible: true,
              message: (resultAction.payload as string) || 'Registration failed',
              type: 'error'
            });
          }
        }
      } catch (err: any) {
        console.log('Registration Error: ', err);
        setToast({ visible: true, message: err.message || 'Validation error', type: 'error' });
      }
    } else {
      setToast({ visible: true, message: 'Passwords do not match', type: 'error' });
    }
  };

  const isValid = password.length >= 6 && password === confirmPassword;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.gradientBackground}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <PasswordDecor />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" />
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>10 / 10</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create a password 🔒</Text>
          <Text style={styles.subtitle}>
            We'll keep your profile safe and secure
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Password"
            placeholder="Enter password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={!showPassword ? <EyeIcon size={25} color={colors.text.tertiary} /> : <EyeOffIcon size={25} color={colors.text.tertiary} />}
            onRightIconPress={() => setShowPassword(!showPassword)}
            autoFocus
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={!showConfirmPassword ? <EyeIcon size={25} color={colors.text.tertiary} /> : <EyeOffIcon size={25} color={colors.text.tertiary} />}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid || isLoading}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              isValid
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.border, colors.ui.border]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>{isLoading ? 'REGISTERING...' : 'COMPLETE'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
    top: '12%',
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

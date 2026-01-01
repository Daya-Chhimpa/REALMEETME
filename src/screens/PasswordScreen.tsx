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
import { colors, shadows } from '../theme/colors';
import { Input } from '../components/Input';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser } from '../redux/slices/authSlice';
import { registerSchema } from '../utils/validation';
import { Toast, ToastType } from '../components/Toast';
import { BackButton } from '../components';

export const PasswordScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft, isLoading, error, token } = useAppSelector(state => state.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'success',
  });

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
      };

      try {
        await registerSchema.validate(finalData);
        // Dispatch Register
        const resultAction = await dispatch(registerUser(finalData));
        if (registerUser.fulfilled.match(resultAction)) {
          setToast({ visible: true, message: 'Registration successful!', type: 'success' });
          // Delay navigation slightly to show toast
          setTimeout(() => {
            navigate('login');
          }, 1500);
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
      <View style={styles.gradientBackground} />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ marginRight: 8, marginTop: 4 }}>
            <BackButton onPress={goBack} variant="default" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Create a secure password</Text>
            <Text style={styles.subtitle}>
              We'll keep your profile safe and secure
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Password"
            placeholder="Enter password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={<Text style={{ fontSize: 20 }}>{!showPassword ? '👁️' : '🔒'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
            autoFocus
          />
          <Input
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            rightIcon={<Text style={{ fontSize: 20 }}>{!showPassword ? '👁️' : '🔒'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              isValid
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.borderDark, colors.ui.borderDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>{isLoading ? 'REGISTERING...' : 'COMPLETE'}</Text>
          </LinearGradient>
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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 4,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
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
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    ...shadows.primaryGlow,
  },
  nextButtonGradient: {
    height: '100%',
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

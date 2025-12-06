import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {Input, BackButton} from '../components';
import {useNavigation} from '../navigation/NavigationContext';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface SignUpData {
  firstName: string;
  gender: 'male' | 'female' | null;
  birthday: {
    day: string;
    month: string;
    year: string;
  };
  password: string;
}

const STEP_ICONS = ['👤', '⚧️', '🎂', '🔐'];
const STEP_TITLES = [
  "What's your name?",
  'Choose your gender',
  "When's your birthday?",
  'Create a password',
];
const STEP_SUBTITLES = [
  "Let's personalize your experience",
  'Help us find your perfect match',
  "We'll never share this publicly",
  'Keep your account secure',
];

export const SignUpScreen: React.FC = () => {
  const {navigate, goBack} = useNavigation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    gender: null,
    birthday: {
      day: '',
      month: '',
      year: '',
    },
    password: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      console.log('Step:', step + 1, 'Data:', formData);
    } else {
      console.log('Sign Up Complete!', formData);
      navigate('relationship');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      goBack();
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName.trim().length >= 2;
      case 2:
        return formData.gender !== null;
      case 3:
        return (
          formData.birthday.day.length === 2 &&
          formData.birthday.month.length === 2 &&
          formData.birthday.year.length === 4
        );
      case 4:
        return formData.password.length >= 6;
      default:
        return false;
    }
  };

  const renderProgressBar = () => {
    const progress = (step / 4) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={colors.gradient.primary as [string, string]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.progressBar, {width: `${progress}%`}]}
          />
        </View>
        <View style={styles.progressSteps}>
          {[1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[
                styles.progressStep,
                i <= step && styles.progressStepActive,
                i === step && styles.progressStepCurrent,
              ]}>
              {i < step ? (
                <Text style={styles.progressStepCheck}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.progressStepNumber,
                    i <= step && styles.progressStepNumberActive,
                  ]}>
                  {i}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Input
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={text => updateFormData('firstName', text)}
              autoFocus
            />
            <Text style={styles.hint}>
              This will be displayed on your profile
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  formData.gender === 'male' && styles.genderOptionSelected,
                ]}
                onPress={() => updateFormData('gender', 'male')}
                activeOpacity={0.8}>
                {formData.gender === 'male' ? (
                  <LinearGradient
                    colors={colors.gradient.primary as [string, string]}
                    style={styles.genderGradient}>
                    <Text style={styles.genderIcon}>👨</Text>
                    <Text style={styles.genderText}>Male</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.genderInner}>
                    <Text style={styles.genderIcon}>👨</Text>
                    <Text style={styles.genderText}>Male</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  formData.gender === 'female' && styles.genderOptionSelected,
                ]}
                onPress={() => updateFormData('gender', 'female')}
                activeOpacity={0.8}>
                {formData.gender === 'female' ? (
                  <LinearGradient
                    colors={colors.gradient.primary as [string, string]}
                    style={styles.genderGradient}>
                    <Text style={styles.genderIcon}>👩</Text>
                    <Text style={styles.genderText}>Female</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.genderInner}>
                    <Text style={styles.genderIcon}>👩</Text>
                    <Text style={styles.genderText}>Female</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.birthdayContainer}>
              <View style={styles.birthdayField}>
                <Text style={styles.birthdayLabel}>Day</Text>
                <Input
                  placeholder="DD"
                  value={formData.birthday.day}
                  onChangeText={text =>
                    updateFormData('birthday', {...formData.birthday, day: text})
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.birthdayField}>
                <Text style={styles.birthdayLabel}>Month</Text>
                <Input
                  placeholder="MM"
                  value={formData.birthday.month}
                  onChangeText={text =>
                    updateFormData('birthday', {...formData.birthday, month: text})
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <View style={styles.birthdayFieldLarge}>
                <Text style={styles.birthdayLabel}>Year</Text>
                <Input
                  placeholder="YYYY"
                  value={formData.birthday.year}
                  onChangeText={text =>
                    updateFormData('birthday', {...formData.birthday, year: text})
                  }
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
            </View>
            <Text style={styles.hint}>
              You must be 18+ to use RealMeet
            </Text>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Input
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={text => updateFormData('password', text)}
              secureTextEntry
            />
            <View style={styles.passwordHints}>
              <View style={styles.passwordHint}>
                <View
                  style={[
                    styles.hintDot,
                    formData.password.length >= 6 && styles.hintDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.hintText,
                    formData.password.length >= 6 && styles.hintTextActive,
                  ]}>
                  At least 6 characters
                </Text>
              </View>
              <View style={styles.passwordHint}>
                <View
                  style={[
                    styles.hintDot,
                    /[A-Z]/.test(formData.password) && styles.hintDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.hintText,
                    /[A-Z]/.test(formData.password) && styles.hintTextActive,
                  ]}>
                  One uppercase letter
                </Text>
              </View>
              <View style={styles.passwordHint}>
                <View
                  style={[
                    styles.hintDot,
                    /[0-9]/.test(formData.password) && styles.hintDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.hintText,
                    /[0-9]/.test(formData.password) && styles.hintTextActive,
                  ]}>
                  One number
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
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

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} variant="default" />

          <View style={styles.headerRight}>
            <Text style={styles.stepIndicator}>Step {step} of 4</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.stepIconContainer}>
            <LinearGradient
              colors={colors.gradient.primary as [string, string]}
              style={styles.stepIconGradient}>
              <Text style={styles.stepIcon}>{STEP_ICONS[step - 1]}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.stepTitle}>{STEP_TITLES[step - 1]}</Text>
          <Text style={styles.stepSubtitle}>{STEP_SUBTITLES[step - 1]}</Text>
        </View>

        {/* Step Content */}
        <View style={styles.formContainer}>{renderStepContent()}</View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, !isStepValid() && styles.nextButtonDisabled]}
            onPress={handleNext}
            activeOpacity={0.9}
            disabled={!isStepValid()}>
            <LinearGradient
              colors={
                isStepValid()
                  ? (colors.gradient.primary as [string, string])
                  : [colors.background.tertiary, colors.background.tertiary]
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.nextButtonGradient}>
              <Text
                style={[
                  styles.nextButtonText,
                  !isStepValid() && styles.nextButtonTextDisabled,
                ]}>
                {step === 4 ? 'COMPLETE' : 'CONTINUE'}
              </Text>
              <Text
                style={[
                  styles.nextButtonArrow,
                  !isStepValid() && styles.nextButtonTextDisabled,
                ]}>
                →
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigate('login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.3,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.2,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.brand.accentMuted,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? spacing[2] : spacing[4],
    marginBottom: spacing[4],
  },
  headerRight: {
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.buttonPill,
  },
  stepIndicator: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },

  // Progress
  progressContainer: {
    marginBottom: spacing[8],
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.ui.divider,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  progressStepActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  progressStepCurrent: {
    ...shadows.primaryGlow,
  },
  progressStepCheck: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  progressStepNumber: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    fontWeight: typography.weight.semibold,
  },
  progressStepNumberActive: {
    color: colors.text.primary,
  },

  // Step Header
  stepHeader: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  stepIconContainer: {
    marginBottom: spacing[4],
  },
  stepIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  stepIcon: {
    fontSize: 36,
  },
  stepTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
    letterSpacing: typography.tracking.tight,
  },
  stepSubtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Form
  formContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.text.quaternary,
    marginTop: spacing[3],
    textAlign: 'center',
  },

  // Gender Selection
  genderContainer: {
    flexDirection: 'row',
    gap: spacing[4],
    justifyContent: 'center',
  },
  genderOption: {
    flex: 1,
    maxWidth: 150,
    aspectRatio: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.tertiary,
  },
  genderOptionSelected: {
    borderColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },
  genderGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  genderText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  // Birthday
  birthdayContainer: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  birthdayField: {
    flex: 1,
  },
  birthdayFieldLarge: {
    flex: 1.5,
  },
  birthdayLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: typography.tracking.wide,
    fontWeight: typography.weight.semibold,
  },

  // Password Hints
  passwordHints: {
    marginTop: spacing[4],
    gap: spacing[2],
  },
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ui.border,
  },
  hintDotActive: {
    backgroundColor: colors.accent.green,
  },
  hintText: {
    fontSize: typography.size.sm,
    color: colors.text.quaternary,
  },
  hintTextActive: {
    color: colors.accent.green,
  },

  // Button
  buttonContainer: {
    paddingVertical: spacing[5],
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[5],
  },
  nextButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  nextButtonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },
  nextButtonTextDisabled: {
    color: colors.text.quaternary,
  },
  nextButtonArrow: {
    fontSize: typography.size.lg,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },
  loginLink: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
});

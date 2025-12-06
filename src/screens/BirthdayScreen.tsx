import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, shadows } from '../theme/colors';
import { Input } from '../components/Input';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';

export const BirthdayScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const [birthday, setBirthday] = useState({
    day: '',
    month: '',
    year: '',
  });

  const handleNext = () => {
    console.log('Birthday:', birthday);
    navigate('relationship');
  };

  const isValid = birthday.day && birthday.month && birthday.year;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>When's your birthday?</Text>
          <Text style={styles.subtitle}>Your age will be public</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.birthdayContainer}>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="DD"
                value={birthday.day}
                onChangeText={text => {
                  setBirthday({ ...birthday, day: text });
                  if (text.length === 2) monthRef.current?.focus();
                }}
                keyboardType="number-pad"
                maxLength={2}
                autoFocus
              />
            </View>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="MM"
                value={birthday.month}
                onChangeText={text => {
                  setBirthday({ ...birthday, month: text });
                  if (text.length === 2) yearRef.current?.focus();
                }}
                keyboardType="number-pad"
                maxLength={2}
                ref={monthRef}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="YYYY"
                value={birthday.year}
                onChangeText={text => setBirthday({ ...birthday, year: text })}
                keyboardType="number-pad"
                maxLength={4}
                ref={yearRef}
              />
            </View>
          </View>
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
            <Text style={styles.nextButtonText}>NEXT</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
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
  birthdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 56,
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

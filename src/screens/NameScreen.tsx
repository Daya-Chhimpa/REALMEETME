import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { colors, shadows } from '../theme/colors';
import { Input } from '../components/Input';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';

export const NameScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const [name, setName] = useState('');

  const handleNext = () => {
    console.log('Name:', name);
    navigate('gender');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>What should we call you? ✨</Text>
          <Text style={styles.subtitle}>This is how you'll appear on RealMeet</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="First name"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !name && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!name}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              name
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
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 56, // Keep height here for container
    // shadowColor handled by glow if needed, or remove specific shadow props here if using ...shadows.primaryGlow
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

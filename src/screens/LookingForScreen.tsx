import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { colors, shadows, spacing } from '../theme/colors';
import { OptionsList, BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';

const LOOKING_FOR_OPTIONS = [
  { id: 'new_friends', label: 'New friends' },
  { id: 'online_companion', label: 'Online companion' },
  { id: 'dating', label: 'Dating' },
  { id: 'serious_relationship', label: 'Serious relationship' },
  { id: 'marriage', label: 'Marriage' },
];

export const LookingForScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    console.log('Looking For:', selected);
    navigate('photos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <OptionsList
          title="What are you looking for"
          subtitle="Select one"
          options={LOOKING_FOR_OPTIONS}
          selected={selected}
          onSelect={setSelected}
        />

        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selected}
          activeOpacity={0.8}>
          <LinearGradient
            colors={
              selected
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
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    marginTop: 20,
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

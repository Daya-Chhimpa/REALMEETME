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
  ScrollView,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { colors, shadows, spacing } from '../theme/colors';
import { OptionsList, BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';

const RELATIONSHIP_OPTIONS = [
  { id: 'Single', label: 'Single' },
  { id: 'Married', label: 'Married' },
  { id: 'Married with kids', label: 'Married with kids' },
  { id: 'Divorced', label: 'Divorced' },
  { id: 'Divorced with kids', label: 'Divorced with kids' },
  { id: 'Widowed', label: 'Widowed' },
  { id: 'Widowed with kids', label: 'Widowed with kids' },
  { id: 'Separated', label: 'Separated' },
  { id: 'Separated with kids', label: 'Separated with kids' },
  { id: 'Single parent', label: 'Single parent' },
];

export const RelationshipStatusScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft } = useAppSelector(state => state.auth);

  const [selected, setSelected] = useState<string | null>((registrationDraft as any).relationshipStatus || null);

  const handleNext = async () => {
    if (selected) {
      await dispatch(saveDraft({ relationshipStatus: selected } as any));
      navigate('lookingfor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        <BackButton onPress={goBack} variant="default" style={{ marginBottom: spacing[5] }} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <OptionsList
            title="What's your current status"
            subtitle="Select one"
            options={RELATIONSHIP_OPTIONS}
            selected={selected}
            onSelect={setSelected}
          />
        </ScrollView>

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

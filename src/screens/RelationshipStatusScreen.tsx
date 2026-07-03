import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { colors, shadows, spacing } from '../theme/colors';
import { OptionsList, BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';

// Decorative background icon
const RelationshipDecor: React.FC = () => (
  <View style={styles.decorContainer}>
    <Text style={styles.decorIcon}>💖</Text>
  </View>
);

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

  const handleNext = async () => {
    if (selected) {
      await dispatch(saveDraft({ relationshipStatus: selected } as any));
      navigate('lookingfor');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.gradientBackground}
      />

      <RelationshipDecor />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" />
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>5 / 10</Text>
          </View>
        </View>

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
                : [colors.ui.border, colors.ui.border]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>CONTINUE</Text>
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
  nextButton: {
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 20,
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

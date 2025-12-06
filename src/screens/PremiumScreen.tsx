import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {BackButton} from '../components';
import {useNavigation} from '../navigation/NavigationContext';

const {width} = Dimensions.get('window');

interface PlanFeature {
  icon: string;
  title: string;
  description: string;
  premium?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  savings?: string;
}

const FEATURES: PlanFeature[] = [
  {
    icon: '💖',
    title: 'Unlimited Likes',
    description: 'Like as many profiles as you want',
    premium: true,
  },
  {
    icon: '👀',
    title: 'See Who Likes You',
    description: 'View all profiles who liked you instantly',
    premium: true,
  },
  {
    icon: '⭐',
    title: 'Super Likes',
    description: '5 Super Likes per day to stand out',
    premium: true,
  },
  {
    icon: '🚀',
    title: 'Profile Boost',
    description: 'Get 10x more visibility for 30 minutes',
    premium: true,
  },
  {
    icon: '↩️',
    title: 'Rewind',
    description: 'Undo accidental left swipes',
    premium: true,
  },
  {
    icon: '🌍',
    title: 'Passport',
    description: 'Match with people anywhere in the world',
    premium: true,
  },
  {
    icon: '🔒',
    title: 'Incognito Mode',
    description: 'Browse profiles without being seen',
    premium: true,
  },
  {
    icon: '✓',
    title: 'No Ads',
    description: 'Enjoy an ad-free experience',
    premium: true,
  },
];

const PLANS: Plan[] = [
  {
    id: '1week',
    name: '1 Week',
    price: '₹199',
    period: '/week',
  },
  {
    id: '1month',
    name: '1 Month',
    price: '₹499',
    period: '/month',
    popular: true,
    savings: 'Save 37%',
  },
  {
    id: '6months',
    name: '6 Months',
    price: '₹1,999',
    period: '/6 months',
    savings: 'Save 50%',
  },
  {
    id: '1year',
    name: '1 Year',
    price: '₹2,999',
    period: '/year',
    savings: 'Best Value',
  },
];

export const PremiumScreen: React.FC = () => {
  const {goBack} = useNavigation();
  const [selectedPlan, setSelectedPlan] = React.useState('1month');

  const handleSubscribe = () => {
    console.log('Subscribe to:', selectedPlan);
    // Handle payment
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={goBack}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={colors.gradient.gold as [string, string]}
            style={styles.crownContainer}>
            <Text style={styles.crownIcon}>👑</Text>
          </LinearGradient>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Get more matches, more visibility, and more chances to find your perfect match
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.plansContainer}>
            {PLANS.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <LinearGradient
                      colors={colors.gradient.primary as [string, string]}
                      style={styles.popularGradient}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </LinearGradient>
                  </View>
                )}
                {plan.savings && !plan.popular && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    <Text style={styles.planPeriod}>{plan.period}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedPlan === plan.id && styles.radioButtonSelected,
                  ]}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Subscription automatically renews unless cancelled at least 24 hours
          before the renewal date.
        </Text>
      </ScrollView>

      {/* Subscribe Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.9}>
          <LinearGradient
            colors={colors.gradient.gold as [string, string]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.subscribeGradient}>
            <Text style={styles.subscribeText}>SUBSCRIBE NOW</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.skipText}>Maybe Later</Text>
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
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[6],
    paddingBottom: spacing[24],
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[5],
    ...shadows.lg,
  },
  crownIcon: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing[4],
  },

  // Features
  featuresSection: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  featuresGrid: {
    gap: spacing[3],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.brand.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  featureDescription: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },

  // Plans
  plansSection: {
    marginBottom: spacing[6],
  },
  plansContainer: {
    gap: spacing[3],
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 2,
    borderColor: colors.ui.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.brand.secondary,
    backgroundColor: colors.brand.primaryMuted,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: spacing[4],
    borderRadius: borderRadius.badge,
    overflow: 'hidden',
  },
  popularGradient: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  popularText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },
  savingsBadge: {
    position: 'absolute',
    top: -12,
    right: spacing[4],
    backgroundColor: colors.accent.green,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.badge,
  },
  savingsText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.brand.secondary,
  },
  planPeriod: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginLeft: spacing[1],
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.ui.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.brand.secondary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brand.secondary,
  },

  // Terms
  termsText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Bottom Container
  bottomContainer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.divider,
  },
  subscribeButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    marginBottom: spacing[3],
    ...shadows.lg,
  },
  subscribeGradient: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    letterSpacing: typography.tracking.wider,
  },
  skipText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {BackButton} from '../components';
import {useNavigation} from '../navigation/NavigationContext';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface SupportOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  action: () => void;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: 'How do I create a profile?',
    answer:
      'To create a profile, download the app and sign up with your phone number or email. Follow the prompts to add your photos, bio, and preferences. Make sure to verify your profile for better visibility.',
  },
  {
    id: 2,
    question: 'How does matching work?',
    answer:
      'When you like someone and they like you back, it\'s a match! You can then start chatting with them. Use Super Likes to increase your chances of matching.',
  },
  {
    id: 3,
    question: 'What is Premium membership?',
    answer:
      'Premium membership gives you unlimited likes, the ability to see who liked you, profile boosts, rewind swipes, and an ad-free experience. Choose from weekly, monthly, or yearly plans.',
  },
  {
    id: 4,
    question: 'How do I report a user?',
    answer:
      'To report a user, go to their profile, tap the three dots menu, and select "Report". Choose the reason for reporting and submit. Our team will review it within 24 hours.',
  },
  {
    id: 5,
    question: 'Can I change my location?',
    answer:
      'With Premium membership, you can use Passport to match with people anywhere in the world. Free users can only match with people in their current location.',
  },
  {
    id: 6,
    question: 'How do I delete my account?',
    answer:
      'Go to Settings > Account > Delete Account. Please note that this action is permanent and you will lose all your matches and messages.',
  },
];

export const HelpSupportScreen: React.FC = () => {
  const {goBack} = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@realmeet.com');
  };

  const handleChat = () => {
    console.log('Open chat support');
  };

  const handleCall = () => {
    Linking.openURL('tel:+911800123456');
  };

  const SUPPORT_OPTIONS: SupportOption[] = [
    {
      id: 'chat',
      icon: '💬',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      action: handleChat,
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Email Us',
      subtitle: 'support@realmeet.com',
      action: handleEmail,
    },
    {
      id: 'call',
      icon: '📞',
      title: 'Call Us',
      subtitle: '1800-123-456 (Toll Free)',
      action: handleCall,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={goBack} variant="default" />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Text style={styles.heroIcon}>💁</Text>
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            We're here to help you with any questions or issues
          </Text>
        </View>

        {/* Quick Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            {SUPPORT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={
                    option.id === 'chat'
                      ? (colors.gradient.primary as [string, string])
                      : [colors.background.tertiary, colors.background.elevated]
                  }
                  style={styles.contactCardGradient}>
                  <View style={styles.contactIconContainer}>
                    <Text style={styles.contactIcon}>{option.icon}</Text>
                  </View>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_DATA.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.faqItem,
                  expandedFAQ === item.id && styles.faqItemExpanded,
                ]}
                onPress={() => toggleFAQ(item.id)}
                activeOpacity={0.8}>
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <View
                    style={[
                      styles.faqIcon,
                      expandedFAQ === item.id && styles.faqIconExpanded,
                    ]}>
                    <Text style={styles.faqIconText}>
                      {expandedFAQ === item.id ? '−' : '+'}
                    </Text>
                  </View>
                </View>
                {expandedFAQ === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>More Resources</Text>
          <View style={styles.linksList}>
            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkIconContainer}>
                <Text style={styles.linkIcon}>📋</Text>
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle}>Terms of Service</Text>
                <Text style={styles.linkSubtitle}>Read our terms and conditions</Text>
              </View>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkIconContainer}>
                <Text style={styles.linkIcon}>🔒</Text>
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle}>Privacy Policy</Text>
                <Text style={styles.linkSubtitle}>How we protect your data</Text>
              </View>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkIconContainer}>
                <Text style={styles.linkIcon}>🛡️</Text>
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle}>Safety Center</Text>
                <Text style={styles.linkSubtitle}>Tips for staying safe</Text>
              </View>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkItem}>
              <View style={styles.linkIconContainer}>
                <Text style={styles.linkIcon}>👥</Text>
              </View>
              <View style={styles.linkContent}>
                <Text style={styles.linkTitle}>Community Guidelines</Text>
                <Text style={styles.linkSubtitle}>Rules for our community</Text>
              </View>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>RealMeet v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 RealMeet. All rights reserved.</Text>
        </View>
      </ScrollView>
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
    paddingBottom: spacing[10],
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brand.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  heroIcon: {
    fontSize: 40,
  },
  heroTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  heroSubtitle: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Section Title
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  // Contact Section
  contactSection: {
    marginBottom: spacing[8],
  },
  contactGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  contactCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  contactCardGradient: {
    padding: spacing[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: borderRadius.lg,
  },
  contactIconContainer: {
    marginBottom: spacing[2],
  },
  contactIcon: {
    fontSize: 28,
  },
  contactTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  contactSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // FAQ Section
  faqSection: {
    marginBottom: spacing[8],
  },
  faqList: {
    gap: spacing[3],
  },
  faqItem: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  faqItemExpanded: {
    borderColor: colors.brand.primary,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginRight: spacing[3],
  },
  faqIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqIconExpanded: {
    backgroundColor: colors.brand.primary,
  },
  faqIconText: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  faqAnswer: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing[3],
    lineHeight: 22,
  },

  // Links Section
  linksSection: {
    marginBottom: spacing[8],
  },
  linksList: {
    gap: spacing[3],
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  linkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  linkIcon: {
    fontSize: 20,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  linkSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  linkArrow: {
    fontSize: typography.size.lg,
    color: colors.text.quaternary,
  },

  // Version
  versionContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
  },
  versionText: {
    fontSize: typography.size.sm,
    color: colors.text.quaternary,
    marginBottom: spacing[1],
  },
  copyrightText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
  },
});

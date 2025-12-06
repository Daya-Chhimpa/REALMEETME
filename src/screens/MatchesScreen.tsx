import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {Sidebar} from '../components/Sidebar';
import {ActionButton} from '../components/Button';
import {useNavigation} from '../navigation/NavigationContext';

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.65;

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  status: string;
  lookingFor: string;
  phone: string;
  image: string;
  verified: boolean;
  online: boolean;
}

const PROFILES: Profile[] = [
  {
    id: 1,
    name: 'Kanchan',
    age: 21,
    location: 'Amritsar',
    status: 'Single',
    lookingFor: 'Looking for non-committal relationship',
    phone: '6284XXXXXX',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    verified: true,
    online: true,
  },
  {
    id: 2,
    name: 'Priya',
    age: 24,
    location: 'Delhi',
    status: 'Single',
    lookingFor: 'Looking for serious relationship',
    phone: '9876XXXXXX',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    verified: true,
    online: false,
  },
  {
    id: 3,
    name: 'Anjali',
    age: 23,
    location: 'Mumbai',
    status: 'Single',
    lookingFor: 'Looking for new friends',
    phone: '8765XXXXXX',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    verified: false,
    online: true,
  },
  {
    id: 4,
    name: 'Simran',
    age: 22,
    location: 'Chandigarh',
    status: 'Single',
    lookingFor: 'Looking for dating',
    phone: '7654XXXXXX',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
    verified: true,
    online: true,
  },
  {
    id: 5,
    name: 'Neha',
    age: 25,
    location: 'Bangalore',
    status: 'Single',
    lookingFor: 'Looking for marriage',
    phone: '6543XXXXXX',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
    verified: true,
    online: false,
  },
];

export const MatchesScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const currentProfile = PROFILES[currentIndex];

  const handleSendMessage = () => {
    console.log('Send Message to:', currentProfile.name);
    navigate('chat');
  };

  const handleSkip = () => {
    console.log('Skip:', currentProfile.name);
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('No more profiles');
    }
  };

  const handleLike = () => {
    console.log('Like:', currentProfile.name);
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('No more profiles');
    }
  };

  const handleSuperLike = () => {
    console.log('Super Like:', currentProfile.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSidebarVisible(true)}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerDot} />
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigate('search')}>
          <Text style={styles.headerIcon}>⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        {currentProfile ? (
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              {/* Profile Image */}
              <Image
                source={{uri: currentProfile.image}}
                style={styles.profileImage}
                resizeMode="cover"
              />

              {/* Top Badges */}
              <View style={styles.topBadges}>
                {currentProfile.online && (
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Online</Text>
                  </View>
                )}
                {currentProfile.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>✓</Text>
                  </View>
                )}
              </View>

              {/* Gradient Overlay */}
              <LinearGradient
                colors={colors.gradient.cardOverlay as [string, string, string]}
                style={styles.cardOverlay}
              />

              {/* Profile Info Overlay */}
              <View style={styles.profileInfoOverlay}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{currentProfile.name}</Text>
                  <Text style={styles.age}>, {currentProfile.age}</Text>
                </View>

                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.location}>{currentProfile.location}</Text>
                </View>

                <Text style={styles.looking}>{currentProfile.lookingFor}</Text>
              </View>
            </View>

            {/* Send Message Button */}
            <TouchableOpacity
              style={styles.sendMessageButton}
              onPress={handleSendMessage}
              activeOpacity={0.9}>
              <LinearGradient
                colors={colors.gradient.accent as [string, string]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.sendMessageGradient}>
                <Text style={styles.sendMessageIcon}>💬</Text>
                <Text style={styles.sendMessageText}>SEND MESSAGE</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Extended Profile Info */}
            <View style={styles.profileDetails}>
              <Text style={styles.sectionTitle}>About</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={styles.infoValue}>{currentProfile.status}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <Text style={styles.infoValue}>{currentProfile.age} years</Text>
                  </View>
                </View>
              </View>

              {/* Verification Section */}
              <Text style={styles.sectionTitle}>Verification</Text>
              <View style={styles.verificationCard}>
                <View style={styles.verificationRow}>
                  <View style={styles.verificationIconContainer}>
                    <Text style={styles.verificationItemIcon}>📱</Text>
                  </View>
                  <View style={styles.verificationInfo}>
                    <Text style={styles.verificationLabel}>Mobile Verified</Text>
                    <Text style={styles.verificationValue}>{currentProfile.phone}</Text>
                  </View>
                  <View style={styles.verifiedCheckmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noMoreProfiles}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>💫</Text>
            </View>
            <Text style={styles.noMoreText}>No more profiles</Text>
            <Text style={styles.noMoreSubtext}>Check back later for new matches!</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons - Fixed at Bottom */}
      {currentProfile && (
        <View style={styles.actionButtonsContainer}>
          <LinearGradient
            colors={['transparent', colors.background.primary]}
            style={styles.actionButtonsGradient}
          />
          <View style={styles.actionButtons}>
            <ActionButton type="skip" onPress={handleSkip} size="md" />
            <ActionButton type="superlike" onPress={handleSuperLike} size="sm" />
            <ActionButton type="like" onPress={handleLike} size="md" />
          </View>
        </View>
      )}

      {/* Sidebar Drawer */}
      <Modal
        visible={sidebarVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSidebarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar onClose={() => setSidebarVisible(false)} />
          </View>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>
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
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand.primary,
    marginLeft: spacing[2],
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: 140,
  },

  // Card
  cardContainer: {
    marginBottom: spacing[6],
  },
  card: {
    borderRadius: borderRadius.cardLarge,
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
    ...shadows.xl,
  },
  profileImage: {
    width: '100%',
    height: CARD_HEIGHT,
  },
  topBadges: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.overlayDark,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
    gap: spacing[2],
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.green,
    ...shadows.greenGlow,
  },
  onlineText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  verifiedIcon: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  cardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  profileInfoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing[5],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  name: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  age: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.normal,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[1],
  },
  locationIcon: {
    fontSize: 14,
  },
  location: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },
  looking: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    marginTop: spacing[2],
  },

  // Send Message Button
  sendMessageButton: {
    marginTop: spacing[4],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.accentGlow,
  },
  sendMessageGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  sendMessageIcon: {
    fontSize: 18,
  },
  sendMessageText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wider,
  },

  // Profile Details
  profileDetails: {
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.tracking.widest,
    marginBottom: spacing[3],
  },
  infoCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[5],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  infoValue: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.ui.border,
  },
  verificationCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.greenGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  verificationItemIcon: {
    fontSize: 22,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  verificationValue: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  verifiedCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.green,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.greenGlow,
  },
  checkmarkIcon: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Action Buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButtonsGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
    gap: spacing[5],
  },

  // No More Profiles
  noMoreProfiles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  emptyIconText: {
    fontSize: 48,
  },
  noMoreText: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  noMoreSubtext: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.ui.overlayDarker,
  },
  modalBackground: {
    flex: 1,
  },
  sidebarContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: colors.background.primary,
    ...shadows.xl,
  },
});

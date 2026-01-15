import React, { useState } from 'react';
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
  Alert,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Sidebar } from '../components/Sidebar';
import { calculateAge } from '../utils/date';
import { ActionButton } from '../components/Button';
import { FloatingHeart } from '../components/FloatingHeart';
import { BackButton } from '../components'; // Ensure BackButton is imported
import { useNavigation } from '../navigation/NavigationContext'; // Adjust if using React Navigation hooks
import { useAppDispatch } from '../redux/hooks';
import { likeUser } from '../redux/slices/matchSlice';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.65;



export const ProfileDetailScreen: React.FC = ({ route }: any) => {
  // If route params are available, use them. Otherwise fallback (though navigation should generally pass params)
  // Since we are using a custom navigation context, we might need to access params differently 
  // or rely on a "selectedProfile" state in Redux. 
  // HOWEVER, looking at NewAndOnlineScreen, it calls navigate('profiledetail'). 
  // The current simple NavigationContext doesn't seem to robustly pass params in the 'navigate' mapped function 
  // unless we enhanced it. 
  // Let's assume for a moment we might need to store the "selected user" in Redux or 
  // modify the usage in NewAndOnlineScreen to pass data via a Redux action "setSelectedProfile".

  // WAIT: The user asked to "click on list item -> show home screen like view".
  // The previous file content shows `navigate` comes from `useNavigation`.
  // If `NavigationContext` is simple, we can't easily pass params.
  // Best approach: Add `selectedUser` to `matchSlice` and set it before navigating.

  // For this step, I will assume we update NewAndOnlineScreen to dispatch "setSelectedUser" 
  // and here we read it. But first I need to add setSelectedUser to slice.
  // Actually, let's look at `NewAndOnlineScreen` again. It logged 'View profile:', user.name.
  // I will update the screen to read from Redux `state.match.selectedProfile`.
  // I will duplicate MatchesScreen UI.

  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [hearts, setHearts] = useState<{ id: number, right: number }[]>([]);

  // We need to fetch the selected profile from Redux. 
  // I'll assume I'll add 'selectedProfile' to the slice in the next step or this one if I could.
  // FOR NOW, let's use the `newUsers` and find one or assume the slice has it.
  // Actually, better: I will update matchSlice to hold `selectedProfile`.
  // But I can't do two files at once with meaningful logic unless I use multi_replace (I am using replace_file_content).
  // I will write this file expecting `selectedProfile` to exist in `state.match`.

  /* 
   * TEMPORARY HACK: If I can't change Redux transparently yet, 
   * I'll try to read the route params IF the navigation library supports it. 
   * But `useNavigation` in this project seems custom. 
   * Let's check `NavigationContext.tsx` later? No, let's just stick to Redux pattern.
   */
  const { selectedProfile } = useAppSelector(state => (state.match as any));
  // Casting to any because I haven't added selectedProfile to the interface yet (I will do it next).

  const currentProfile = selectedProfile;

  const handleSendMessage = () => {
    console.log('Send Message to:', currentProfile?.name);
    navigate('chat');
  };

  const handleSkip = () => {
    goBack();
  };

  const handleLike = () => {
    if (currentProfile) {
      dispatch(likeUser(currentProfile._id));

      // Trigger animation: 5 hearts sequentially
      let count = 0;
      const interval = setInterval(() => {
        if (count >= 5) {
          clearInterval(interval);
          return;
        }
        const newHeart = {
          id: Date.now() + Math.random(),
          right: 20 + Math.random() * 30 // Random position around right side
        };
        setHearts(prev => [...prev, newHeart]);
        count++;
      }, 100);
    }
  };

  const removeHeart = (id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
  };

  const handleSuperLike = () => {
    console.log('Super Like:', currentProfile?.name);
  };

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" />
        </View>
        <View style={styles.noMoreProfiles}>
          <Text>No profile selected</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Hearts Container */}
      <View style={styles.heartsContainer} pointerEvents="none">
        {hearts.map(heart => (
          <FloatingHeart
            key={heart.id}
            onComplete={() => removeHeart(heart.id)}
            style={{ right: heart.right + '%' }}
          />
        ))}
      </View>

      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* Background Gradient */}
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={goBack} variant="default" />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSidebarVisible(true)}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content - Reused from MatchesScreen */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Profile Image */}
            <Image
              source={{
                uri: currentProfile.image || currentProfile.images?.[0]?.url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop'
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />

            {/* Top Badges */}
            <View style={styles.topBadges}>
              {currentProfile.isOnline && (
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
                <Text style={styles.age}>, {calculateAge(currentProfile.dob || currentProfile.age)}</Text>
              </View>

              {currentProfile.location && (
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.location}>
                    {currentProfile.location}
                  </Text>
                </View>
              )}

              <Text style={styles.looking}>
                {currentProfile.status || 'Looking for a connection'}
              </Text>
            </View>
          </View>

          {/* Send Message Button */}
          <TouchableOpacity
            style={styles.sendMessageButton}
            onPress={handleSendMessage}
            activeOpacity={0.9}>
            <LinearGradient
              colors={colors.gradient.accent as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
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
                  <Text style={styles.infoValue}>{currentProfile.status || 'Single'}</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>{calculateAge(currentProfile.dob || currentProfile.age)} years</Text>
                </View>
              </View>
            </View>

            {/* Verification Section */}
            <Text style={styles.sectionTitle}>Verification</Text>
            <View style={styles.verificationCard}>
              <View style={styles.verificationRow}>
                <View style={styles.verificationIconContainer}>
                  <Text style={styles.verificationItemIcon}>
                    {currentProfile.verified ? '🛡️' : '⏱️'}
                  </Text>
                </View>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationLabel}>
                    {currentProfile.verified ? 'Identity Verified' : 'Pending Verification'}
                  </Text>
                  <Text style={styles.verificationValue}>
                    {currentProfile.verified ? 'Profile authentic' : 'Details under review'}
                  </Text>
                </View>
                {currentProfile.verified && (
                  <View style={styles.verifiedCheckmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Interests - if available */}
            {/* Note: New Users API might not return interests in the same format or at all. Add safe check */}
            {currentProfile.interests && Array.isArray(currentProfile.interests) && currentProfile.interests.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Interests</Text>
                <View style={[styles.infoCard, { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }]}>
                  {currentProfile.interests.map((interest: any, idx: number) => (
                    <View key={idx} style={{
                      backgroundColor: colors.background.primary,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: colors.ui.border
                    }}>
                      <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                        {typeof interest === 'object' ? interest.name : interest}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

      </ScrollView>

      {/* Action Buttons - Fixed at Bottom */}
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
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  age: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.normal,
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
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
  // Missing text styles from original file?
  noMoreProfiles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'flex-end',
    // align items? no we position absolutely
  },

});

// Import missing components if needed; reusing ActionButton, BackButton, Sidebar.
import { useAppSelector } from '../redux/hooks';

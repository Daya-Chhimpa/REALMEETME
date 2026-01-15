import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Sidebar } from '../components/Sidebar';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getLikesList, likeUser, setSelectedProfile } from '../redux/slices/matchSlice';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing[4] * 3) / 2;

export const LikesYouScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { likesList, likesLoading } = useAppSelector(state => state.match);

  useEffect(() => {
    dispatch(getLikesList({ page: 1, limit: 1000 })); // Fetch reasonable amount
  }, [dispatch]);

  const handleUserPress = (user: any) => {
    dispatch(setSelectedProfile(user));
    navigate('profiledetail');
  };

  const handleLikeBack = (userId: string) => {
    console.log('Liked back:', userId);
    dispatch(likeUser(userId));
    // Optimistically update or re-fetch? 
    // Usually liking back moves them to Matches.
    // For now, let's just trigger the API.
  };

  const handleMessage = (userId: string) => {
    navigate('chat');
  };

  const handleSkip = (userId: string) => {
    // Implement skip/remove logic if API supports it, or local hide
  };

  const handleGoPremium = () => {
    navigate('premium');
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
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Likes You</Text>
          <View style={styles.likesCount}>
            <Text style={styles.likesCountIcon}>💖</Text>
            <Text style={styles.likesCountText}>{likesList.length}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Banner */}
      <TouchableOpacity
        style={styles.premiumBanner}
        onPress={handleGoPremium}
        activeOpacity={0.9}>
        <LinearGradient
          colors={colors.gradient.gold as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.premiumGradient}>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumIcon}>👑</Text>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>See who likes you instantly!</Text>
              <Text style={styles.premiumSubtitle}>Upgrade to Premium to reveal all</Text>
            </View>
          </View>
          <View style={styles.premiumArrowContainer}>
            <Text style={styles.premiumArrow}>→</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Likes Grid */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {likesLoading ? (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="large" color={colors.brand.primary} />
          </View>
        ) : (
          <>
            <View style={styles.grid}>
              {likesList?.map(user => (
                <TouchableOpacity
                  key={user._id}
                  style={styles.card}
                  onPress={() => handleUserPress(user)}
                  activeOpacity={0.9}>
                  <Image
                    source={{
                      uri: user.images?.[0]?.url
                        ? user.images[0].url
                        : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop'
                    }}
                    style={styles.cardImage}
                  />

                  {/* Online Indicator */}
                  {user.isOnline && (
                    <View style={styles.onlineBadge}>
                      <View style={styles.onlineDot} />
                    </View>
                  )}

                  {/* Verified Badge */}
                  {user.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedIcon}>✓</Text>
                    </View>
                  )}

                  {/* Like Badge */}
                  <View style={styles.likeBadge}>
                    <LinearGradient
                      colors={colors.gradient.primary as [string, string]}
                      style={styles.likeBadgeGradient}>
                      <Text style={styles.likeBadgeIcon}>❤️</Text>
                    </LinearGradient>
                  </View>

                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={colors.gradient.cardOverlay as [string, string, string]}
                    style={styles.cardOverlay}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>
                        {user.name}, {user.age}
                      </Text>
                      <Text style={styles.cardLocation}>
                        {(user.address as any)?.name || (typeof user.location === 'string' ? user.location : (user.location as any)?.address) || 'Unknown'}
                      </Text>

                      {/* <Text style={styles.cardTime}>Liked {user.likedTime}</Text> */}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => handleSkip(user._id)}>
                        <Text style={styles.skipIcon}>✕</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => handleMessage(user._id)}>
                        <Text style={styles.messageIcon}>💬</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.likeBackButton}
                        onPress={() => handleLikeBack(user._id)}>
                        <LinearGradient
                          colors={colors.gradient.primary as [string, string]}
                          style={styles.likeBackGradient}>
                          <Text style={styles.likeBackIcon}>❤️</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {likesList.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Text style={styles.emptyIconText}>💫</Text>
                </View>
                <Text style={styles.emptyTitle}>No likes yet</Text>
                <Text style={styles.emptySubtitle}>
                  Keep swiping to get more matches!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

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
    </SafeAreaView >
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  likesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand.primaryMuted,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
    gap: spacing[1],
  },
  likesCountIcon: {
    fontSize: 14,
  },
  likesCountText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },

  // Premium Banner
  premiumBanner: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing[3],
  },
  premiumIcon: {
    fontSize: 28,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
  },
  premiumSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.inverse,
    opacity: 0.9,
    marginTop: spacing[1],
  },
  premiumArrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumArrow: {
    fontSize: typography.size.lg,
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    paddingTop: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing[4],
    backgroundColor: colors.background.tertiary,
    ...shadows.lg,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  onlineBadge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    padding: spacing[1],
    borderRadius: borderRadius.full,
    backgroundColor: colors.ui.overlayDark,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.green,
    ...shadows.greenGlow,
  },
  verifiedBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  verifiedIcon: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  likeBadge: {
    position: 'absolute',
    top: '40%',
    right: -10,
    transform: [{ rotate: '-15deg' }],
  },
  likeBadgeGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  likeBadgeIcon: {
    fontSize: 22,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[3],
    paddingTop: spacing[10],
  },
  cardInfo: {
    marginBottom: spacing[3],
  },
  cardName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[1],
  },
  locationIcon: {
    fontSize: 10,
  },
  cardLocation: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  cardTime: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },

  // Card Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[2],
  },
  skipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ui.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  skipIcon: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ui.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brand.accent,
  },
  messageIcon: {
    fontSize: 16,
  },
  likeBackButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  likeBackGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.primaryGlow,
  },
  likeBackIcon: {
    fontSize: 16,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[20],
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
  emptyTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptySubtitle: {
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

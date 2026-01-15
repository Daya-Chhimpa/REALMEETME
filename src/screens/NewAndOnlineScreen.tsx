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
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Sidebar } from '../components/Sidebar';
import { useNavigation } from '../navigation/NavigationContext';

const { width } = Dimensions.get('window');

type FilterType = 'all' | 'new' | 'online';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getNewUsers, setSelectedProfile } from '../redux/slices/matchSlice';

export const NewAndOnlineScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { newUsers, newUsersLoading } = useAppSelector(state => state.match);

  React.useEffect(() => {
    dispatch(getNewUsers());
  }, [dispatch]);

  const mappedUsers = React.useMemo(() => {
    return (newUsers || []).map((user: any) => ({
      id: user._id,
      name: user.name,
      age: user.age || 20, // Fallback age if missing
      // Handle various location structures: address object with name, or string
      location: user.address?.name || user.address || (typeof user.location === 'string' ? user.location : user.location?.address) || '',
      status: user.maritalStatus || user.lookingFor || 'Single',
      image: user.images?.[0]?.url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop',
      isOnline: user.isOnline || false,
      verified: user.isVerified || false,
      isNew: true,
    }));
  }, [newUsers]);

  const filteredUsers = mappedUsers.filter(user => {
    if (activeFilter === 'new') return user.isNew;
    if (activeFilter === 'online') return user.isOnline; // Simplified logic
    return true;
  });

  const handleChatNow = (user: any) => {
    console.log('Chat with:', user.name);
    navigate('chat');
  };

  const handleUserPress = (user: any) => {
    console.log('View profile:', user.name);
    const originalUser = newUsers.find((u: any) => u._id === user.id);
    if (originalUser) {
      dispatch(setSelectedProfile(originalUser));
      navigate('profiledetail');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.backgroundGradient}
      />

      {/* Decorative Elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}>
          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>☰</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>New & Online</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineCount}>11,659 online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.filterIconButton}>
          <Text style={styles.filterIcon}>⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}>
          {activeFilter === 'all' ? (
            <LinearGradient
              colors={colors.gradient.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterTabGradient}>
              <Text style={styles.filterTabTextActive}>All</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.filterTabText}>All</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'new' && styles.filterTabActive]}
          onPress={() => setActiveFilter('new')}>
          {activeFilter === 'new' ? (
            <LinearGradient
              colors={colors.gradient.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterTabGradient}>
              <Text style={styles.filterTabTextActive}>✨ New</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.filterTabText}>✨ New</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeFilter === 'online' && styles.filterTabActive]}
          onPress={() => setActiveFilter('online')}>
          {activeFilter === 'online' ? (
            <LinearGradient
              colors={colors.gradient.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterTabGradient}>
              <Text style={styles.filterTabTextActive}>🟢 Online</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.filterTabText}>🟢 Online</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredUsers.map(user => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => handleUserPress(user)}
            activeOpacity={0.9}>
            <View style={styles.cardContent}>
              <View style={styles.userInfo}>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={() => handleUserPress(user)}>
                  <Image source={{ uri: user.image }} style={styles.avatar} />
                  {user.isOnline && (
                    <View style={styles.onlineIndicator}>
                      <View style={styles.onlineIndicatorInner} />
                    </View>
                  )}
                  {user.isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.userDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                    {user.verified && (
                      <LinearGradient
                        colors={['#00D4AA', '#00B894']}
                        style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                      </LinearGradient>
                    )}
                  </View>
                  <View style={styles.locationRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.userLocation}>
                      {user.age} yrs • {user.location}
                    </Text>
                  </View>
                  <Text style={styles.userStatus} numberOfLines={1}>{user.status}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => handleChatNow(user)}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradient.primary as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.chatButtonGradient}>
                  <Text style={styles.chatButtonIcon}>💬</Text>
                  <Text style={styles.chatButtonText}>Chat</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>Try changing your filters</Text>
          </View>
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
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.15,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.brand.accentMuted,
    opacity: 0.1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.green,
    marginRight: spacing[2],
    ...shadows.greenGlow,
  },
  onlineCount: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  filterTab: {
    flex: 1,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
  },
  filterTabActive: {
    ...shadows.sm,
  },
  filterTabGradient: {
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing[3],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.button,
  },
  filterTabTextActive: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },

  // User Card
  userCard: {
    marginBottom: spacing[4],
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.cardBg,
    borderWidth: 1,
    borderColor: colors.ui.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing[3],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing[4],
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.ui.border,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicatorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.green,
    ...shadows.greenGlow,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    ...shadows.sm,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  userName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginRight: spacing[2],
    flex: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  locationIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  userLocation: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  userStatus: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },

  // Chat Button
  chatButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    ...shadows.sm,
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  chatButtonIcon: {
    fontSize: 14,
  },
  chatButtonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[4],
  },
  emptyText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptySubtext: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser } from '../redux/slices/authSlice';
import { resetMatchState } from '../redux/slices/matchSlice';

interface SidebarProps {
  onClose: () => void;
}

interface MenuItem {
  id: string;
  screen: 'matches' | 'newonline' | 'search' | 'likesyou' | 'visitors' | 'messages';
  label: string;
  icon: string;
  badge?: number | string;
  isOnline?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: '1', screen: 'matches', label: 'Discover', icon: '🎯' },
  { id: '2', screen: 'newonline', label: 'New & Online', icon: '✨', isOnline: true, badge: '11659' },
  { id: '3', screen: 'search', label: 'Search', icon: '🔍' },
  { id: '4', screen: 'likesyou', label: 'Likes You', icon: '💖', badge: 12 },
  { id: '5', screen: 'messages', label: 'Messages', icon: '💬', badge: 3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { navigate, currentScreen, reset } = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleMenuItemPress = (screen: MenuItem['screen']) => {
    navigate(screen);
    onClose();
  };
  // ...


  const handleProfilePress = () => {
    navigate('profiledetail');
    onClose();
  };

  const handleEditProfilePress = () => {
    navigate('editprofile');
    onClose();
  };

  const handlePremiumPress = () => {
    navigate('premium');
    onClose();
  };

  const handleHelpPress = () => {
    navigate('help');
    onClose();
  };

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    dispatch(resetMatchState());
    reset('welcome');
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <LinearGradient
        colors={[colors.background.secondary, colors.background.primary]}
        style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleProfilePress}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri: user?.images?.[0]?.url || user?.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff&size=200`
                }}
                style={styles.profileImage}
                defaultSource={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff&size=200` }}
              />
              <View style={styles.profileOnlineIndicator} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleEditProfilePress}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>{user?.name || 'User'}</Text>

        {/* Premium Banner */}
        <TouchableOpacity style={styles.premiumBanner} activeOpacity={0.9} onPress={handlePremiumPress}>
          <LinearGradient
            colors={colors.gradient.gold as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}>
            <Text style={styles.premiumIcon}>👑</Text>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Go Premium</Text>
              <Text style={styles.premiumSubtitle}>Unlock all features</Text>
            </View>
            <Text style={styles.premiumArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleMenuItemPress(item.screen)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.menuIconContainer,
                  isActive && styles.menuIconContainerActive,
                ]}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {item.label}
              </Text>

              {/* Badge */}
              {item.badge && (
                <View
                  style={[
                    styles.menuBadge,
                    item.isOnline ? styles.menuBadgeOnline : styles.menuBadgeCount,
                  ]}>
                  {item.isOnline && <View style={styles.onlineDot} />}
                  <Text
                    style={[
                      styles.menuBadgeText,
                      item.isOnline && styles.menuBadgeTextOnline,
                    ]}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={handleHelpPress}>
          <Text style={styles.footerIcon}>❓</Text>
          <Text style={styles.footerText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={handleSignOut}>
          <Text style={styles.footerIcon}>🚪</Text>
          <Text style={styles.footerText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Profile Section
  profileSection: {
    paddingTop: 60,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },
  profileOnlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent.green,
    borderWidth: 3,
    borderColor: colors.background.secondary,
    ...shadows.greenGlow,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  profileName: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },

  // Profile Stats
  profileStats: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.ui.border,
    marginVertical: spacing[1],
  },

  // Premium Banner
  premiumBanner: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    gap: spacing[3],
  },
  premiumIcon: {
    fontSize: 24,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
  },
  premiumSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.inverse,
    opacity: 0.8,
  },
  premiumArrow: {
    fontSize: typography.size.xl,
    color: colors.text.inverse,
    fontWeight: typography.weight.bold,
  },

  // Menu Container
  menuContainer: {
    flex: 1,
    paddingTop: spacing[4],
    paddingHorizontal: spacing[3],
  },

  // Menu Item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[1],
    borderRadius: borderRadius.lg,
  },
  menuItemActive: {
    backgroundColor: colors.brand.primaryMuted,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  menuIconContainerActive: {
    backgroundColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuText: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  menuTextActive: {
    color: colors.brand.primary,
  },

  // Menu Badge
  menuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
    gap: spacing[1],
  },
  menuBadgeOnline: {
    backgroundColor: colors.background.tertiary,
  },
  menuBadgeCount: {
    backgroundColor: colors.brand.primary,
    ...shadows.sm,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.green,
    ...shadows.greenGlow,
  },
  menuBadgeText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  menuBadgeTextOnline: {
    color: colors.text.secondary,
    fontWeight: typography.weight.semibold,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.ui.divider,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  footerIcon: {
    fontSize: 18,
    opacity: 0.7,
  },
  footerText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    fontWeight: typography.weight.medium,
  },
});

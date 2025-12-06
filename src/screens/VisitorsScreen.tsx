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
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {Sidebar} from '../components/Sidebar';
import {useNavigation} from '../navigation/NavigationContext';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - spacing[5] * 2 - spacing[3]) / 2;

interface Visitor {
  id: number;
  name: string;
  age: number;
  image: string;
  visitedTime: string;
  status: 'message_sent' | 'liked' | 'viewed';
  isOnline?: boolean;
  verified?: boolean;
}

const VISITORS: Visitor[] = [
  {
    id: 1,
    name: 'Roop',
    age: 27,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    visitedTime: '15 mins ago',
    status: 'message_sent',
    isOnline: true,
    verified: true,
  },
  {
    id: 2,
    name: 'Disha',
    age: 23,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    visitedTime: '7 hours ago',
    status: 'message_sent',
    isOnline: true,
    verified: true,
  },
  {
    id: 3,
    name: 'Maya',
    age: 24,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    visitedTime: '10 hours ago',
    status: 'liked',
    isOnline: false,
    verified: false,
  },
  {
    id: 4,
    name: 'Yashi',
    age: 30,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
    visitedTime: '12 hours ago',
    status: 'message_sent',
    isOnline: false,
    verified: true,
  },
  {
    id: 5,
    name: 'Priya',
    age: 25,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
    visitedTime: '1 day ago',
    status: 'viewed',
    isOnline: true,
    verified: true,
  },
  {
    id: 6,
    name: 'Anjali',
    age: 26,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    visitedTime: '2 days ago',
    status: 'viewed',
    isOnline: false,
    verified: false,
  },
  {
    id: 7,
    name: 'Sneha',
    age: 28,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    visitedTime: '3 days ago',
    status: 'liked',
    isOnline: true,
    verified: true,
  },
  {
    id: 8,
    name: 'Kavya',
    age: 22,
    image: 'https://images.unsplash.com/photo-1502323777036-f29e3972f12e?w=400&h=500&fit=crop',
    visitedTime: '4 days ago',
    status: 'viewed',
    isOnline: false,
    verified: true,
  },
];

export const VisitorsScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleVisitorPress = (visitor: Visitor) => {
    console.log('Visitor pressed:', visitor.name);
    navigate('profiledetail');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'message_sent':
        return {
          text: 'Message sent',
          icon: '💬',
          colors: [colors.brand.primary, colors.brand.accent],
        };
      case 'liked':
        return {
          text: 'Liked you!',
          icon: '💖',
          colors: ['#FF6B6B', '#FF8E8E'],
        };
      case 'viewed':
        return {
          text: 'Viewed',
          icon: '👁️',
          colors: [colors.text.tertiary, colors.text.quaternary],
        };
      default:
        return {
          text: '',
          icon: '',
          colors: [colors.text.tertiary, colors.text.quaternary],
        };
    }
  };

  const totalVisitors = VISITORS.length;

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
          <Text style={styles.headerTitle}>Visitors</Text>
          <View style={styles.visitorBadge}>
            <Text style={styles.visitorIcon}>👁️</Text>
            <Text style={styles.visitorCount}>{totalVisitors} visitors</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.filterIconButton}>
          <Text style={styles.filterIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <LinearGradient
            colors={colors.gradient.primary as [string, string]}
            style={styles.statIconBg}>
            <Text style={styles.statIcon}>💬</Text>
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {VISITORS.filter(v => v.status === 'message_sent').length}
            </Text>
            <Text style={styles.statLabel}>Messaged</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.statIconBg}>
            <Text style={styles.statIcon}>💖</Text>
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {VISITORS.filter(v => v.status === 'liked').length}
            </Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={styles.statIconBgGray}>
            <Text style={styles.statIcon}>👁️</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {VISITORS.filter(v => v.status === 'viewed').length}
            </Text>
            <Text style={styles.statLabel}>Viewed</Text>
          </View>
        </View>
      </View>

      {/* Visitors Grid */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {VISITORS.map(visitor => {
            const statusConfig = getStatusConfig(visitor.status);
            return (
              <TouchableOpacity
                key={visitor.id}
                style={styles.card}
                onPress={() => handleVisitorPress(visitor)}
                activeOpacity={0.9}>
                <Image source={{uri: visitor.image}} style={styles.cardImage} />

                {/* Online Indicator */}
                {visitor.isOnline && (
                  <View style={styles.onlineIndicator}>
                    <View style={styles.onlineDot} />
                  </View>
                )}

                {/* Verified Badge */}
                {visitor.verified && (
                  <LinearGradient
                    colors={['#00D4AA', '#00B894']}
                    style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>✓</Text>
                  </LinearGradient>
                )}

                {/* Card Overlay */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.cardOverlay}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>
                      {visitor.name}, {visitor.age}
                    </Text>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeIcon}>🕐</Text>
                      <Text style={styles.cardTime}>{visitor.visitedTime}</Text>
                    </View>

                    {/* Status Badge */}
                    <View style={styles.statusBadgeContainer}>
                      <LinearGradient
                        colors={statusConfig.colors as [string, string]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.statusBadge}>
                        <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
                        <Text style={styles.statusText}>{statusConfig.text}</Text>
                      </LinearGradient>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {VISITORS.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👀</Text>
            <Text style={styles.emptyText}>No visitors yet</Text>
            <Text style={styles.emptySubtext}>
              Complete your profile to attract more visitors
            </Text>
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
  visitorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.buttonPill,
    gap: spacing[1],
  },
  visitorIcon: {
    fontSize: 12,
  },
  visitorCount: {
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

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing[5],
    marginBottom: spacing[5],
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
    ...shadows.md,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconBgGray: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
  },
  statInfo: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.ui.border,
    marginHorizontal: spacing[2],
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
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
  onlineIndicator: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  verifiedIcon: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing[10],
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[3],
  },
  cardInfo: {
    gap: spacing[1],
  },
  cardName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  timeIcon: {
    fontSize: 10,
  },
  cardTime: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  statusBadgeContainer: {
    marginTop: spacing[2],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    gap: spacing[1],
  },
  statusIcon: {
    fontSize: 10,
  },
  statusText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  emptyText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptySubtext: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing[8],
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

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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {Sidebar} from '../components/Sidebar';
import {useNavigation} from '../navigation/NavigationContext';

interface Message {
  id: number;
  name: string;
  age: number;
  image: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  verified: boolean;
}

const MESSAGES: Message[] = [
  {
    id: 1,
    name: 'Priya',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    lastMessage: 'Hey! How are you doing?',
    time: '2m ago',
    unread: true,
    online: true,
    verified: true,
  },
  {
    id: 2,
    name: 'Anjali',
    age: 23,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    lastMessage: 'That sounds great! Let me know when you are free.',
    time: '1h ago',
    unread: false,
    online: true,
    verified: true,
  },
  {
    id: 3,
    name: 'Simran',
    age: 22,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
    lastMessage: 'See you tomorrow at the cafe!',
    time: '3h ago',
    unread: false,
    online: false,
    verified: false,
  },
  {
    id: 4,
    name: 'Neha',
    age: 25,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
    lastMessage: 'Thanks for your help! Really appreciate it.',
    time: '1d ago',
    unread: false,
    online: false,
    verified: true,
  },
];

export const MessagesScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMessagePress = (message: Message) => {
    console.log('Open chat with:', message.name);
    navigate('chat');
  };

  const unreadCount = MESSAGES.filter(m => m.unread).length;

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
          <Text style={styles.headerTitle}>Messages</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Online Now Section */}
      <View style={styles.onlineSection}>
        <Text style={styles.sectionTitle}>Online Now</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.onlineScrollContent}>
          {MESSAGES.filter(m => m.online).map(message => (
            <TouchableOpacity
              key={message.id}
              style={styles.onlineUserItem}
              onPress={() => handleMessagePress(message)}>
              <View style={styles.onlineAvatarContainer}>
                <Image source={{uri: message.image}} style={styles.onlineAvatar} />
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.onlineUserName} numberOfLines={1}>
                {message.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Messages List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}>
        <Text style={styles.sectionTitle}>Recent Chats</Text>

        {MESSAGES.map((message, index) => (
          <TouchableOpacity
            key={message.id}
            style={[
              styles.messageCard,
              message.unread && styles.messageCardUnread,
            ]}
            onPress={() => handleMessagePress(message)}
            activeOpacity={0.7}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image source={{uri: message.image}} style={styles.avatar} />
              {message.online && <View style={styles.avatarOnlineIndicator} />}
            </View>

            {/* Message Info */}
            <View style={styles.messageInfo}>
              <View style={styles.messageHeader}>
                <View style={styles.nameContainer}>
                  <Text style={styles.messageName}>
                    {message.name}, {message.age}
                  </Text>
                  {message.verified && (
                    <View style={styles.miniVerifiedBadge}>
                      <Text style={styles.miniVerifiedIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.messageTime, message.unread && styles.messageTimeUnread]}>
                  {message.time}
                </Text>
              </View>
              <Text
                style={[styles.messageText, message.unread && styles.messageTextUnread]}
                numberOfLines={1}>
                {message.lastMessage}
              </Text>
            </View>

            {/* Unread Indicator */}
            {message.unread && (
              <View style={styles.unreadBadge}>
                <View style={styles.unreadDot} />
              </View>
            )}
          </TouchableOpacity>
        ))}
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
  unreadCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
    paddingHorizontal: spacing[2],
    ...shadows.primaryGlow,
  },
  unreadCountText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },

  // Online Section
  onlineSection: {
    paddingTop: spacing[2],
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.tracking.widest,
    paddingHorizontal: spacing[6],
    marginBottom: spacing[3],
  },
  onlineScrollContent: {
    paddingHorizontal: spacing[6],
    gap: spacing[4],
  },
  onlineUserItem: {
    alignItems: 'center',
    width: 68,
  },
  onlineAvatarContainer: {
    position: 'relative',
    marginBottom: spacing[2],
  },
  onlineAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.brand.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent.green,
    borderWidth: 2.5,
    borderColor: colors.background.primary,
    ...shadows.greenGlow,
  },
  onlineUserName: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginHorizontal: spacing[6],
    marginVertical: spacing[5],
  },

  // Content
  content: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: spacing[6],
  },

  // Message Card
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    marginHorizontal: spacing[3],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
  },
  messageCardUnread: {
    backgroundColor: colors.brand.primaryMuted,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing[4],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.tertiary,
  },
  avatarOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent.green,
    borderWidth: 2.5,
    borderColor: colors.background.primary,
    ...shadows.greenGlow,
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  messageName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  miniVerifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniVerifiedIcon: {
    fontSize: 9,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  messageTime: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
  },
  messageTimeUnread: {
    color: colors.brand.primary,
    fontWeight: typography.weight.semibold,
  },
  messageText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  messageTextUnread: {
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  unreadBadge: {
    marginLeft: spacing[3],
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand.primary,
    ...shadows.primaryGlow,
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

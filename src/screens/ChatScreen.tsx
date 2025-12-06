import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, shadows, borderRadius, typography, spacing} from '../theme/colors';
import {BackButton} from '../components';
import {useNavigation} from '../navigation/NavigationContext';

const {width} = Dimensions.get('window');

interface ChatMessage {
  id: number;
  text: string;
  isMine: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    text: 'Hey! How are you doing?',
    isMine: false,
    time: '10:30 AM',
  },
  {
    id: 2,
    text: "Hi! I'm doing great, thanks! How about you?",
    isMine: true,
    time: '10:32 AM',
    status: 'read',
  },
  {
    id: 3,
    text: "I'm good too! Would you like to meet for coffee sometime?",
    isMine: false,
    time: '10:35 AM',
  },
  {
    id: 4,
    text: 'That sounds great! When are you free?',
    isMine: true,
    time: '10:37 AM',
    status: 'delivered',
  },
  {
    id: 5,
    text: 'How about this weekend? Saturday afternoon works for me.',
    isMine: false,
    time: '10:40 AM',
  },
];

interface ChatUser {
  name: string;
  age: number;
  image: string;
  online: boolean;
  verified: boolean;
}

const CHAT_USER: ChatUser = {
  name: 'Priya',
  age: 24,
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  online: true,
  verified: true,
};

export const ChatScreen: React.FC = () => {
  const {goBack, navigate} = useNavigation();
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        text: inputText,
        isMine: true,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  const handleProfilePress = () => {
    navigate('profiledetail');
  };

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case 'read':
        return <Text style={styles.statusIcon}>✓✓</Text>;
      case 'delivered':
        return <Text style={styles.statusIconDelivered}>✓✓</Text>;
      case 'sent':
        return <Text style={styles.statusIconSent}>✓</Text>;
      default:
        return null;
    }
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
        <BackButton onPress={goBack} variant="default" />

        <TouchableOpacity style={styles.headerInfo} onPress={handleProfilePress}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: CHAT_USER.image}} style={styles.headerImage} />
            {CHAT_USER.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.headerName}>
                {CHAT_USER.name}, {CHAT_USER.age}
              </Text>
              {CHAT_USER.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online now</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {/* Date Separator */}
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>Today</Text>
            <View style={styles.dateLine} />
          </View>

          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.isMine ? styles.myMessageRow : styles.theirMessageRow,
              ]}>
              {message.isMine ? (
                <LinearGradient
                  colors={colors.gradient.primary as [string, string]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[styles.messageBubble, styles.myMessage]}>
                  <Text style={styles.messageText}>{message.text}</Text>
                  <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>{message.time}</Text>
                    {renderMessageStatus(message.status)}
                  </View>
                </LinearGradient>
              ) : (
                <View style={[styles.messageBubble, styles.theirMessage]}>
                  <Text style={styles.messageText}>{message.text}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionText}>👋 Say Hi!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionText}>☕ Coffee?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionText}>😊 How are you?</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>+</Text>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.text.quaternary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={styles.emojiIcon}>😊</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.8}>
            <LinearGradient
              colors={
                inputText.trim()
                  ? (colors.gradient.primary as [string, string])
                  : [colors.background.tertiary, colors.background.tertiary]
              }
              style={styles.sendButtonGradient}>
              <Text style={styles.sendIcon}>➤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing[3],
  },
  avatarContainer: {
    position: 'relative',
  },
  headerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  headerText: {
    flex: 1,
    marginLeft: spacing[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.green,
    marginRight: spacing[1],
  },
  onlineText: {
    fontSize: typography.size.xs,
    color: colors.accent.green,
    fontWeight: typography.weight.medium,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },

  // Content
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing[4],
    paddingBottom: spacing[2],
  },

  // Date Separator
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.ui.divider,
  },
  dateText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
    paddingHorizontal: spacing[3],
    fontWeight: typography.weight.medium,
  },

  // Messages
  messageRow: {
    marginBottom: spacing[3],
  },
  myMessageRow: {
    alignItems: 'flex-end',
  },
  theirMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: borderRadius.xl,
    padding: spacing[3],
    paddingHorizontal: spacing[4],
  },
  myMessage: {
    borderBottomRightRadius: borderRadius.xs,
    ...shadows.sm,
  },
  theirMessage: {
    backgroundColor: colors.background.tertiary,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  messageText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing[1],
    gap: spacing[1],
  },
  messageTime: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    alignSelf: 'flex-end',
  },
  statusIcon: {
    fontSize: 12,
    color: colors.accent.cyan,
  },
  statusIconDelivered: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  statusIconSent: {
    fontSize: 12,
    color: colors.text.quaternary,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  quickAction: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.buttonPill,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  quickActionText: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
    fontWeight: typography.weight.medium,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.ui.divider,
    gap: spacing[3],
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  attachIcon: {
    fontSize: 24,
    color: colors.text.secondary,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    minHeight: 44,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.text.primary,
    maxHeight: 100,
    paddingVertical: spacing[1],
  },
  emojiButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
  emojiIcon: {
    fontSize: 22,
  },
  sendButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
});

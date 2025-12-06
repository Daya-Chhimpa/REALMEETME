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
import {colors, spacing} from '../theme/colors';
import {Sidebar, BackButton} from '../components';
import {useNavigation} from '../navigation/NavigationContext';

export const ProfileDetailScreen: React.FC = () => {
  const {goBack} = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Sample profile data - will be passed via navigation params later
  const profile = {
    name: 'Priya',
    age: 24,
    location: 'Delhi',
    status: 'Single',
    lookingFor: 'Looking for serious relationship',
    phone: '9876XXXXXX',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    bio: 'Love traveling, reading books, and meeting new people. Looking for someone genuine and caring.',
    interests: ['Travel', 'Reading', 'Music', 'Cooking'],
  };

  const handleSendMessage = () => {
    console.log('Send Message to:', profile.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={goBack} variant="default" />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image source={{uri: profile.image}} style={styles.profileImage} />
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <View style={styles.locationBadge}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{profile.location}</Text>
            </View>
          </View>

          <Text style={styles.status}>{profile.status}</Text>
          <Text style={styles.looking}>{profile.lookingFor}</Text>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Verification */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <View style={styles.verificationRow}>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>📱</Text>
              </View>
              <Text style={styles.verifiedText}>Mobile Number</Text>
            </View>
            <Text style={styles.phoneNumber}>{profile.phone}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at Bottom */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => console.log('Like')}
          activeOpacity={0.8}>
          <Text style={styles.likeIcon}>💜</Text>
          <Text style={styles.likeText}>LIKE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendMessageButton}
          onPress={handleSendMessage}
          activeOpacity={0.8}>
          <Text style={styles.sendMessageIcon}>💬</Text>
          <Text style={styles.sendMessageText}>MESSAGE</Text>
        </TouchableOpacity>
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
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: colors.background.cardBg,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  status: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  looking: {
    fontSize: 14,
    color: colors.brand.purple,
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -8,
  },
  interestTag: {
    backgroundColor: colors.brand.purple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verifiedIcon: {
    fontSize: 16,
  },
  verifiedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 44,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.ui.borderDark,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background.cardBg,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: colors.brand.purple,
  },
  likeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  likeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.brand.purple,
    letterSpacing: 1,
  },
  sendMessageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.brand.purple,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: colors.brand.purple,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendMessageIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sendMessageText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  sidebarContainer: {
    width: '75%',
    maxWidth: 300,
    backgroundColor: colors.background.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
});

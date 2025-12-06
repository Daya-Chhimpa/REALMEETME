import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {colors} from '../theme/colors';
import {useNavigation} from '../navigation/NavigationContext';

export const PhotoUploadScreen: React.FC = () => {
  const {navigate, goBack} = useNavigation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  const handleAddPhoto = async (source: string) => {
    setShowUploadModal(false);

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    try {
      let result;
      if (source === 'camera') {
        result = await launchCamera(options);
      } else if (source === 'gallery') {
        result = await launchImageLibrary(options);
      } else {
        Alert.alert('Coming Soon', 'Facebook integration coming soon!');
        return;
      }

      if (result.didCancel) {
        console.log('User cancelled');
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      } else if (result.assets && result.assets[0].uri) {
        const newPhotos = [...photos];
        newPhotos[selectedSlot] = result.assets[0].uri;
        setPhotos(newPhotos);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSkip = () => {
    console.log('Skip photo upload');
    navigate('password');
  };

  const handleSubmit = () => {
    console.log('Submit photos:', photos);
    navigate('password');
  };

  const renderPhotoSlot = (index: number) => {
    const hasPhoto = photos[index];
    return (
      <TouchableOpacity
        key={index}
        style={styles.photoSlot}
        onPress={() => {
          setSelectedSlot(index);
          setShowUploadModal(true);
        }}
        activeOpacity={0.7}>
        {hasPhoto ? (
          <Image source={{uri: hasPhoto}} style={styles.photoImage} />
        ) : (
          <Text style={styles.photoSlotIcon}>+</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upload your photos</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {[0, 1, 2].map(renderPhotoSlot)}
        </View>
        <View style={styles.photoGrid}>
          {[3, 4].map(renderPhotoSlot)}
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Upload photos to show up in matches
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Photos</Text>
              <TouchableOpacity
                onPress={() => setShowUploadModal(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleAddPhoto('gallery')}
              activeOpacity={0.7}>
              <View style={styles.uploadOptionIcon}>
                <Text style={styles.uploadOptionEmoji}>🖼️</Text>
              </View>
              <View style={styles.uploadOptionText}>
                <Text style={styles.uploadOptionTitle}>From Gallery</Text>
                <Text style={styles.uploadOptionSubtitle}>
                  It's fast and easy!
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleAddPhoto('facebook')}
              activeOpacity={0.7}>
              <View style={styles.uploadOptionIcon}>
                <Text style={styles.uploadOptionEmoji}>📘</Text>
              </View>
              <View style={styles.uploadOptionText}>
                <Text style={styles.uploadOptionTitle}>From Facebook</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => handleAddPhoto('camera')}
              activeOpacity={0.7}>
              <View style={styles.uploadOptionIcon}>
                <Text style={styles.uploadOptionEmoji}>📷</Text>
              </View>
              <View style={styles.uploadOptionText}>
                <Text style={styles.uploadOptionTitle}>Take a selfie</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.modalInfoContainer}>
              <Text style={styles.modalInfoIcon}>💡</Text>
              <Text style={styles.modalInfoText}>
                Upload photos to show up in matches
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  title: {
    fontSize: Math.min(28, SCREEN_WIDTH * 0.07),
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  photoGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  photoSlot: {
    width: Math.min(100, SCREEN_WIDTH * 0.22),
    height: Math.min(100, SCREEN_WIDTH * 0.22),
    borderRadius: Math.min(50, SCREEN_WIDTH * 0.11),
    backgroundColor: colors.background.cardBg,
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.ui.borderDark,
    marginHorizontal: SCREEN_WIDTH * 0.02,
  },
  photoSlotIcon: {
    fontSize: 40,
    color: colors.text.tertiary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  submitButton: {
    backgroundColor: colors.ui.borderDark,
    borderRadius: 12,
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.text.primary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.background.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.primary,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  uploadOptionIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  uploadOptionEmoji: {
    fontSize: 32,
  },
  uploadOptionText: {
    flex: 1,
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
  },
  uploadOptionSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  modalInfoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modalInfoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});

import React, { useState } from 'react';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';
import api from '../services/api';

export const PhotoUploadScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft } = useAppSelector(state => state.auth);

  const [photos, setPhotos] = useState<string[]>(
    (registrationDraft.images || []).map(img => img.url)
  );
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

  const [isUploading, setIsUploading] = useState(false);



  const handleSkip = () => {
    navigate('password');
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      handleSkip();
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = photos.map(async (uri) => {
        // Skip if it's already a remote URL (starts with http) - though logic says we start with local
        if (uri.startsWith('http')) {
          // If already uploaded (maybe coming back to screen), return formatted object
          // But current logic in state initialization maps draft images to urls.
          // We need to preserve the full object if it's already there?
          // Simplification: Assume all in state 'photos' are local URIs unless we handle re-entry logic better.
          // But actually, `photos` state is initialized from `draft.images`.
          // If they are already remote URLs, we shouldn't re-upload.
          // We can check if `uri.startsWith('http')`.
          return {
            url: uri,
            type: 'image/jpeg', // Fallback or we should store full obj in local state?
            filename: uri.split('/').pop() || 'image.jpg'
          };
        }

        const formData = new FormData();
        formData.append('images', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          type: 'image/jpeg',
          name: uri.split('/').pop() || 'image.jpg',
        });

        // We need to use axios directly or the api instance.
        // Assuming api instance is imported.
        const response = await api.post('/utility/uploadFiles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data[0]; // The API returns an array for the uploaded file
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const validImages = results.filter(img => img !== null);

      await dispatch(saveDraft({ images: validImages }));
      navigate('password');
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload Error', 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
          <Image source={{ uri: hasPhoto }} style={styles.photoImage} />
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
          <BackButton onPress={goBack} variant="default" />
          <Text style={styles.title}>Upload your photos</Text>
          <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
          style={styles.actionButtonContainer}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              photos.length > 0
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.borderDark, colors.ui.borderDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>
              {isUploading ? 'UPLOADING...' : (photos.length > 0 ? 'CONTINUE' : 'SKIP')}
            </Text>
            {photos.length > 0 && <Text style={styles.actionButtonArrow}>→</Text>}
          </LinearGradient>
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
  actionButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 'auto',
    ...shadows.primaryGlow,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    height: Math.max(50, SCREEN_WIDTH * 0.13),
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
  actionButtonArrow: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '700',
  },
});

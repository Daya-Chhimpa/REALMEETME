import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,

  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { launchImageLibrary } from 'react-native-image-picker';
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

  // Define the structure closer to what we need
  interface PhotoData {
    url: string;
    type: string;
    filename: string;
  }

  // Initialize with full objects if available, otherwise reconstruct or empty
  const [photos, setPhotos] = useState<PhotoData[]>(
    (registrationDraft.images || [])
  );

  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (uri: string, slotIndex: number) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: uri.split('/').pop() || 'image.jpg',
      });

      const response = await api.post('/utility/uploadFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const uploadedImage = response.data.data[0];

        // Update photos based on previous state to avoid race conditions
        setPhotos(prevPhotos => {
          const newPhotos = [...prevPhotos];
          newPhotos[slotIndex] = uploadedImage;

          // Dispatch inside here? Or useEffect? using prevPhotos is pure.
          // We can dispatch outside, but we need the new array.
          // Dispatching with the calculated newPhotos:
          dispatch(saveDraft({ images: newPhotos.filter(p => p !== undefined && p !== null) }));

          return newPhotos;
        });

      }
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhoto = async (index: number) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as const,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User cancelled');
      } else if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      } else if (result.assets && result.assets[0].uri) {
        // Immediately upload, passing the intended index
        await uploadImage(result.assets[0].uri, index);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    const validPhotos = photos.filter(p => p && p.url);
    if (validPhotos.length === 0) {
      Alert.alert('Photo Required', 'Please upload at least one photo.');
      return;
    }
    await dispatch(saveDraft({ images: validPhotos }));
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
          handleAddPhoto(index);
        }}
        activeOpacity={0.7}>
        {hasPhoto ? (
          <Image source={{ uri: hasPhoto.url }} style={styles.photoImage} />
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
              {isUploading ? 'UPLOADING...' : 'CONTINUE'}
            </Text>
            {photos.length > 0 && <Text style={styles.actionButtonArrow}>→</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal removed as per user request to use direct gallery upload */}
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

import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, spacing } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';
import api from '../services/api';

// Structure of Photo
interface PhotoData {
  url: string;
  type: string;
  filename: string;
}

// Decorative background icon
const PhotoDecor: React.FC = () => (
  <View style={styles.decorContainer}>
    <Text style={styles.decorIcon}>📸</Text>
  </View>
);

export const PhotoUploadScreen: React.FC = () => {
  const { navigate, goBack } = useNavigation();
  const dispatch = useAppDispatch();
  const { registrationDraft } = useAppSelector(state => state.auth);

  const [photos, setPhotos] = useState<PhotoData[]>(
    (registrationDraft.images || [])
  );

  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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

        setPhotos(prevPhotos => {
          const newPhotos = [...prevPhotos];
          newPhotos[slotIndex] = uploadedImage;
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
        await uploadImage(result.assets[0].uri, index);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      // Instead of splicing which shifts slots, set to null/empty slot
      newPhotos[index] = null as any;
      dispatch(saveDraft({ images: newPhotos.filter(p => p !== undefined && p !== null) }));
      return newPhotos;
    });
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
      <View key={index} style={styles.photoSlotContainer}>
        <TouchableOpacity
          style={[styles.photoSlot, hasPhoto && styles.photoSlotActive]}
          onPress={() => {
            setSelectedSlot(index);
            handleAddPhoto(index);
          }}
          activeOpacity={0.7}>
          {hasPhoto ? (
            <Image source={{ uri: hasPhoto.url }} style={styles.photoImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.photoSlotIcon}>+</Text>
            </View>
          )}
        </TouchableOpacity>
        {hasPhoto && (
          <TouchableOpacity
            style={styles.deleteBadge}
            onPress={() => handleDeletePhoto(index)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBadgeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const hasAnyPhoto = photos.some(p => p && p.url);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <LinearGradient
        colors={colors.gradient.dark as [string, string, string]}
        style={styles.gradientBackground}
      />

      <PhotoDecor />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={goBack} variant="default" />
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>9 / 10</Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Upload your photos 📸</Text>
          <Text style={styles.subtitle}>
            Upload photos to show up in matches. Select at least one photo.
          </Text>
        </View>

        {/* Photo Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.photoRow}>
            {[0, 1, 2].map(renderPhotoSlot)}
          </View>
          <View style={styles.photoRow}>
            {[3, 4].map(renderPhotoSlot)}
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Clear, high-quality photos get 3x more matches!
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.nextButton, !hasAnyPhoto && styles.nextButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!hasAnyPhoto || isUploading}
        >
          <LinearGradient
            colors={
              hasAnyPhoto
                ? (colors.gradient.primary as [string, string])
                : [colors.ui.border, colors.ui.border]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {isUploading ? 'UPLOADING...' : 'CONTINUE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
  },
  decorContainer: {
    position: 'absolute',
    top: '12%',
    right: -20,
    opacity: 0.1,
    transform: [{ rotate: '15deg' }, { scale: 1.5 }],
    zIndex: 0,
  },
  decorIcon: {
    fontSize: 180,
    color: colors.brand.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    justifyContent: 'space-between',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBadge: {
    backgroundColor: colors.ui.overlay,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.tertiary,
    lineHeight: 24,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    marginVertical: 16,
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  photoSlotContainer: {
    position: 'relative',
  },
  photoSlot: {
    width: (SCREEN_WIDTH - spacing[6] * 2 - 16 * 2) / 3,
    height: 130,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.ui.border,
    borderStyle: 'dashed',
  },
  photoSlotActive: {
    borderStyle: 'solid',
    borderColor: colors.brand.primary,
    ...shadows.primaryGlow,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSlotIcon: {
    fontSize: 32,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent.red,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.background.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  deleteBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 179, 71, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.brand.secondary,
    padding: 16,
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
    color: colors.brand.secondary,
    lineHeight: 20,
  },
  nextButton: {
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  nextButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: colors.ui.border,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 2,
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, spacing, borderRadius } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getProfile, updateProfile } from '../redux/slices/authSlice';
import { Toast, ToastType } from '../components/Toast';
import api from '../services/api';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

// --- Constants ---

const RELATIONSHIP_OPTIONS = [
  { id: 'single', label: 'Single' },
  { id: 'married', label: 'Married' },
  { id: 'married_kids', label: 'Married with kids' },
  { id: 'divorced', label: 'Divorced' },
  { id: 'divorced_kids', label: 'Divorced with kids' },
  { id: 'widowed', label: 'Widowed' },
  { id: 'widowed_kids', label: 'Widowed with kids' },
  { id: 'separated', label: 'Separated' },
  { id: 'separated_kids', label: 'Separated with kids' },
  { id: 'single_parent', label: 'Single parent' },
];

const LOOKING_FOR_OPTIONS = [
  { id: 'new_friends', label: 'New friends' },
  { id: 'online_companion', label: 'Online companion' },
  { id: 'dating', label: 'Dating' },
  { id: 'serious_relationship', label: 'Serious relationship' },
  { id: 'marriage', label: 'Marriage' },
];

const GENDER_OPTIONS = [
  { id: 'Male', label: 'Male' },
  { id: 'Female', label: 'Female' },
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  { label: 'Jan', value: '01' }, { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' },
  { label: 'Apr', value: '04' }, { label: 'May', value: '05' }, { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' }, { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' },
  { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: (currentYear - 13) - 1970 + 1 }, (_, i) => String(currentYear - 13 - i));

interface DropdownProps {
  label: string;
  value: string;
  options: any[];
  onSelect: (val: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onSelect, placeholder }) => {
  const [visible, setVisible] = useState(false);
  const getLabel = (val: string) => {
    if (!val) return placeholder;
    const option = options.find(o => (typeof o === 'string' ? o : o.value) === val);
    if (!option) return val;
    return typeof option === 'string' ? option : option.label;
  };

  return (
    <>
      <TouchableOpacity style={styles.pickerInput} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={[styles.pickerText, !value && styles.placeholderText]}>{getLabel(value)}</Text>
        <Text style={[styles.pickerIcon, { fontSize: 10 }]}>▼</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '50%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}><Text style={styles.closeText}>Close</Text></TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => (typeof item === 'string' ? item : item.value)}
              renderItem={({ item }) => {
                const itemValue = typeof item === 'string' ? item : item.value;
                const itemLabel = typeof item === 'string' ? item : item.label;
                return (
                  <TouchableOpacity style={[styles.optionItem, itemValue === value && styles.optionItemSelected]} onPress={() => { onSelect(itemValue); setVisible(false); }}>
                    <Text style={[styles.optionText, itemValue === value && styles.optionTextSelected]}>{itemLabel}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

// --- Sub-components ---

interface SelectionModalProps {
  visible: boolean;
  title: string;
  options: { id: string; label: string }[];
  onSelect: (value: string) => void;
  onClose: () => void;
  selectedValue?: string;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ visible, title, options, onSelect, onClose, selectedValue }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.optionItem, item.id === selectedValue && styles.optionItemSelected]}
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <Text style={[styles.optionText, item.id === selectedValue && styles.optionTextSelected]}>
                {item.label}
              </Text>
              {item.id === selectedValue && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

interface CityModalProps {
  visible: boolean;
  onSelect: (id: string, name: string) => void;
  onClose: () => void;
  selectedId?: string;
}

const CityModal: React.FC<CityModalProps> = ({ visible, onSelect, onClose, selectedId }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (visible) {
      fetchCities();
    }
  }, [visible]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await api.post('/cities', {});
      if (response.data?.data?.cities) {
        setCities(response.data.data.cities);
      }
    } catch (error) {
      console.log('Error fetching cities', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: '90%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select City</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              placeholderTextColor={colors.text.tertiary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {loading ? (
            <ActivityIndicator color={colors.brand.primary} size="large" />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, item._id === selectedId && styles.cityItemSelected]}
                  onPress={() => {
                    onSelect(item._id, item.name);
                    onClose();
                  }}
                >
                  <Text style={[styles.cityText, item._id === selectedId && styles.cityTextSelected]}>
                    {item.name}
                  </Text>
                  <Text style={styles.cityState}>{item.state}</Text>
                  {item._id === selectedId && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

interface InterestsModalProps {
  visible: boolean;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
}

const InterestsModal: React.FC<InterestsModalProps> = ({ visible, selectedIds, onSave, onClose }) => {
  const [allInterests, setAllInterests] = useState<any[]>([]);
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLocalSelected([...selectedIds]);
      fetchInterests();
    }
  }, [visible]);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interests');
      if (response.data?.data) {
        setAllInterests(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching interests', error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) => {
    if (localSelected.includes(id)) {
      setLocalSelected(prev => prev.filter(i => i !== id));
    } else {
      setLocalSelected(prev => [...prev, id]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: '85%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Interests</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.brand.primary} size="large" />
          ) : (
            <ScrollView contentContainerStyle={styles.interestsContainer}>
              {allInterests.map(interest => {
                const isSelected = localSelected.includes(interest._id);
                return (
                  <TouchableOpacity
                    key={interest._id}
                    style={[styles.interestChip, isSelected && styles.interestChipSelected]}
                    onPress={() => toggle(interest._id)}
                  >
                    <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                      {interest.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={() => {
              onSave(localSelected);
              onClose();
            }}
          >
            <Text style={styles.modalSaveButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- Main Component ---

export const EditProfileScreen: React.FC = () => {
  const { goBack, navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dobParts, setDobParts] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');

  const [addressId, setAddressId] = useState<string>('');
  const [addressName, setAddressName] = useState<string>('');

  const [status, setStatus] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [interestIds, setInterestIds] = useState<string[]>([]);

  const [currentImages, setCurrentImages] = useState<any[]>([]);
  const [profileImageUri, setProfileImageUri] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Modals State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLookingModal, setShowLookingModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  // Initialize Data
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || '');

      if (user.dob) {
        try {
          const date = new Date(user.dob);
          if (!isNaN(date.getTime())) {
            const y = date.getFullYear().toString();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            setDobParts({ day: d, month: m, year: y });
          } else {
            // Fallback for non-standard formats if any
            if (user.dob.includes('-')) {
              const [y, m, d] = user.dob.split('-');
              setDobParts({ day: d, month: m, year: y });
            } else if (user.dob.includes('/')) {
              const [d, m, y] = user.dob.split('/');
              setDobParts({ day: d, month: m, year: y });
            }
          }
        } catch (e) {
          console.log('Error parsing DOB', e);
        }
      }
      setGender(user.gender || '');
      setAddressId(user.address || ''); // Assuming API returns ID
      // If the API returns a populated address object, handle it, otherwise we might just have ID
      // For display, we might need to fetch the city name or rely on user.location if available
      setAddressName(user.location || user.addressName || ''); // improved callback

      setStatus(user.relationshipStatus || '');
      setLookingFor(user.lookingFor || '');
      setInterestIds(user.interests || []);

      if (user.images && user.images.length > 0) {
        setCurrentImages(user.images);
        const imgUrl = user.images[0].url;
        setProfileImageUri(imgUrl);
        setImageError(false);
      }
    }
  }, [user]);

  // Helpers
  const getLabel = (options: any[], val: string) => options.find(o => o.id === val)?.label || val;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dobParts.day || !dobParts.month || !dobParts.year) newErrors.dob = 'Complete Date of Birth is required';
    if (!addressId && !addressName) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setToast({ visible: true, message: 'Please fix validation errors', type: 'error' });
      return;
    }

    const formattedDob = `${dobParts.year}-${dobParts.month}-${dobParts.day}`;
    const profileData = {
      name,
      dob: formattedDob,
      gender,
      address: addressId, // Send ID
      relationshipStatus: status,
      lookingFor,
      interests: interestIds,
      images: currentImages, // Send updated images array
    };

    try {
      const resultAction = await dispatch(updateProfile(profileData));
      if (updateProfile.fulfilled.match(resultAction)) {
        await dispatch(getProfile()); // Refresh profile data
        setToast({ visible: true, message: 'Profile updated successfully', type: 'success' });
      } else {
        setToast({ visible: true, message: 'Failed to update profile', type: 'error' });
      }
    } catch {
      setToast({ visible: true, message: 'An error occurred', type: 'error' });
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      if (result.assets && result.assets[0]) {
        // Show immediately (local preview)
        const asset = result.assets[0];
        setProfileImageUri(asset.uri || '');
        setImageError(false);

        // Upload
        await uploadImage(asset);
      }
    } catch (err) {
      console.log('Image Picker Error', err);
    }
  };

  const uploadImage = async (asset: any) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('images', {
      uri: asset.uri,
      type: asset.type,
      name: asset.fileName || 'profile_image.jpg',
    });

    try {
      console.log('Uploading image...');
      const response = await api.post('/utility/uploadFiles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedData = response.data?.data;
      console.log('Upload response:', uploadedData);

      if (uploadedData) {
        // Handle both array and single object response
        const newImage = Array.isArray(uploadedData) ? uploadedData[0] : uploadedData;

        if (newImage && newImage.url) {
          // Update currentImages state safely using functional update to avoid stale state
          setCurrentImages(prevImages => {
            const safePrev = Array.isArray(prevImages) ? prevImages : [];
            // Replace index 0 with new image, keep the rest
            if (safePrev.length > 0) {
              return [newImage, ...safePrev.slice(1)];
            } else {
              return [newImage];
            }
          });
          // Update profileImageUri to remote URL to ensure consistency (optional, but good for saving state)
          // But usually we keep local URI for smoother UX until save/refresh.
          // Let's stick to local which is already set in handlePickImage.
        }

        setToast({ visible: true, message: 'Image uploaded successfully.', type: 'success' });
      } else {
        throw new Error("No data received");
      }
    } catch (e: any) {
      console.error("Upload failed", e);
      setToast({ visible: true, message: 'Image upload failed. Please try again.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <View style={styles.gradientBackground} />

      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={hideToast} />

      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={goBack} variant="default" />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
          <Text style={styles.saveText}>{isLoading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.imageSection}>
          <View>
            <Image
              source={{
                uri: !imageError && profileImageUri
                  ? profileImageUri
                  : DEFAULT_AVATAR
              }}
              style={styles.profileImage}
              onError={() => setImageError(true)}
            />
            {uploading && (
              <View style={[styles.profileImage, styles.loadingOverlay]}>
                <ActivityIndicator color={colors.brand.primary} />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handlePickImage} style={styles.changePhotoButton} disabled={uploading}>
            <Text style={styles.changePhotoText}>{uploading ? 'Uploading...' : 'Change Photo'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.name ? styles.errorInput : undefined]}
              value={name}
              onChangeText={(t) => { setName(t); if (errors.name) setErrors({ ...errors, name: '' }); }}
              placeholder="Name"
              placeholderTextColor={colors.text.tertiary}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Mobile (Disabled) */}
          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={mobile}
              editable={false}
            />
          </View>

          {/* Gender */}
          <TouchableOpacity style={styles.field} onPress={() => setShowGenderModal(true)} activeOpacity={0.8}>
            <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
            <View style={[styles.pickerInput, errors.gender ? styles.errorInput : undefined]}>
              <Text style={[styles.pickerText, !gender && styles.placeholderText]}>
                {gender ? getLabel(GENDER_OPTIONS, gender) : 'Select Gender'}
              </Text>
              <Text style={styles.pickerIcon}>▼</Text>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </TouchableOpacity>

          {/* DOB */}
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth <Text style={styles.required}>*</Text></Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 0.8 }}>
                <Dropdown
                  label="DD"
                  value={dobParts.day}
                  options={DAYS}
                  placeholder="DD"
                  onSelect={(val) => {
                    setDobParts(prev => ({ ...prev, day: val }));
                    if (errors.dob) setErrors({ ...errors, dob: '' });
                  }}
                />
              </View>
              <View style={{ flex: 1.2 }}>
                <Dropdown
                  label="Month"
                  value={dobParts.month}
                  options={MONTHS}
                  placeholder="Month"
                  onSelect={(val) => {
                    setDobParts(prev => ({ ...prev, month: val }));
                    if (errors.dob) setErrors({ ...errors, dob: '' });
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Dropdown
                  label="Year"
                  value={dobParts.year}
                  options={YEARS}
                  placeholder="Year"
                  onSelect={(val) => {
                    setDobParts(prev => ({ ...prev, year: val }));
                    if (errors.dob) setErrors({ ...errors, dob: '' });
                  }}
                />
              </View>
            </View>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
          </View>

          {/* Address */}
          <TouchableOpacity style={styles.field} onPress={() => setShowCityModal(true)} activeOpacity={0.8}>
            <Text style={styles.label}>Address <Text style={styles.required}>*</Text></Text>
            <View style={[styles.pickerInput, errors.address ? styles.errorInput : undefined]}>
              <Text style={[styles.pickerText, !addressName && !addressId && styles.placeholderText]}>
                {addressName || 'Select Address'}
              </Text>
              <Text style={styles.pickerIcon}>▼</Text>
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </TouchableOpacity>

          {/* Relationship Status */}
          <TouchableOpacity style={styles.field} onPress={() => setShowStatusModal(true)} activeOpacity={0.8}>
            <Text style={styles.label}>Relationship Status</Text>
            <View style={styles.pickerInput}>
              <Text style={[styles.pickerText, !status && styles.placeholderText]}>
                {status ? getLabel(RELATIONSHIP_OPTIONS, status) : 'Select Status'}
              </Text>
              <Text style={styles.pickerIcon}>▼</Text>
            </View>
          </TouchableOpacity>

          {/* Looking For */}
          <TouchableOpacity style={styles.field} onPress={() => setShowLookingModal(true)} activeOpacity={0.8}>
            <Text style={styles.label}>Looking For</Text>
            <View style={styles.pickerInput}>
              <Text style={[styles.pickerText, !lookingFor && styles.placeholderText]}>
                {lookingFor ? getLabel(LOOKING_FOR_OPTIONS, lookingFor) : 'Select Option'}
              </Text>
              <Text style={styles.pickerIcon}>▼</Text>
            </View>
          </TouchableOpacity>

          {/* Interests */}
          <TouchableOpacity style={styles.field} onPress={() => setShowInterestsModal(true)} activeOpacity={0.8}>
            <Text style={styles.label}>Interests</Text>
            <View style={[styles.pickerInput, { minHeight: 50, height: 'auto', paddingVertical: 12 }]}>
              <Text style={[styles.pickerText, interestIds.length === 0 && styles.placeholderText]}>
                {interestIds.length > 0 ? `${interestIds.length} Selected` : 'Select Interests'}
              </Text>
              <Text style={styles.pickerIcon}>▼</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changePasswordButton} onPress={() => navigate('changepassword')}>
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <SelectionModal
        visible={showGenderModal}
        title="Select Gender"
        options={GENDER_OPTIONS}
        onSelect={setGender}
        onClose={() => setShowGenderModal(false)}
        selectedValue={gender}
      />

      <SelectionModal
        visible={showStatusModal}
        title="Relationship Status"
        options={RELATIONSHIP_OPTIONS}
        onSelect={setStatus}
        onClose={() => setShowStatusModal(false)}
        selectedValue={status}
      />

      <SelectionModal
        visible={showLookingModal}
        title="Looking For"
        options={LOOKING_FOR_OPTIONS}
        onSelect={setLookingFor}
        onClose={() => setShowLookingModal(false)}
        selectedValue={lookingFor}
      />

      <CityModal
        visible={showCityModal}
        onSelect={(id, name) => {
          setAddressId(id);
          setAddressName(name);
        }}
        onClose={() => setShowCityModal(false)}
        selectedId={addressId}
      />

      <InterestsModal
        visible={showInterestsModal}
        selectedIds={interestIds}
        onSave={(ids) => setInterestIds(ids)}
        onClose={() => setShowInterestsModal(false)}
      />

    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.brand.purple,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.cardBg,
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand.purple,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.ui.borderDark,
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pickerInput: {
    backgroundColor: colors.background.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.ui.borderDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  placeholderText: {
    color: colors.text.tertiary,
  },
  pickerIcon: {
    color: colors.text.tertiary,
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 32,
  },
  required: {
    color: 'red',
    fontSize: 14,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  changePasswordButton: {
    marginTop: 10,
    backgroundColor: colors.background.tertiary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  changePasswordText: {
    color: colors.text.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  closeText: {
    color: colors.brand.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  optionTextSelected: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  checkIcon: {
    color: colors.brand.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // City Modal Specific
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  searchIcon: {
    fontSize: 18,
    color: colors.text.tertiary,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    height: '100%',
  },
  cityItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cityText: {
    fontSize: 16,
    color: colors.text.primary,
    marginRight: 8,
  },
  cityTextSelected: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  cityState: {
    fontSize: 14,
    color: colors.text.tertiary,
    flex: 1,
  },
  // Interests Modal Specific
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  interestChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  interestChipSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  interestText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  modalSaveButton: {
    backgroundColor: colors.brand.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  modalSaveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

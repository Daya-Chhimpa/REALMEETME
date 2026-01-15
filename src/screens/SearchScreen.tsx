import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Modal,
  ScrollView,
  FlatList,
  Dimensions,
  PanResponder,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Sidebar } from '../components/Sidebar';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setFilters, resetFilters, getRandomUsers, updateFilters, loadFilters } from '../redux/slices/matchSlice';
import api from '../services/api';

const { width } = Dimensions.get('window');

const SLIDER_WIDTH = width - spacing[6] * 2 - 70 - spacing[3] * 2; // Account for label and value

// Custom Slider Component
interface SliderProps {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  sliderWidth: number;
}

const CustomSlider: React.FC<SliderProps> = ({ value, min, max, onValueChange, sliderWidth }) => {
  const currentValue = useRef(value);

  const percentage = ((value - min) / (max - min)) * 100;
  const thumbPosition = (percentage / 100) * sliderWidth;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newPercentage = Math.max(0, Math.min(1, touchX / sliderWidth));
        const newValue = Math.round(min + newPercentage * (max - min));
        currentValue.current = newValue;
        onValueChange(newValue);
      },
      onPanResponderMove: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        const newPercentage = Math.max(0, Math.min(1, touchX / sliderWidth));
        const newValue = Math.round(min + newPercentage * (max - min));
        if (newValue !== currentValue.current) {
          currentValue.current = newValue;
          onValueChange(newValue);
        }
      },
      onPanResponderRelease: () => { },
    })
  ).current;

  return (
    <View style={sliderStyles.container} {...panResponder.panHandlers}>
      <View style={sliderStyles.track}>
        <LinearGradient
          colors={colors.gradient.primary as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[sliderStyles.fill, { width: `${percentage}%` }]}
          pointerEvents="none"
        />
      </View>
      <View style={[sliderStyles.thumb, { left: thumbPosition - 14 }]} pointerEvents="none">
        <LinearGradient
          colors={colors.gradient.primary as [string, string]}
          style={sliderStyles.thumbInner}
          pointerEvents="none"
        />
      </View>
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 8,
    backgroundColor: colors.ui.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    top: 8,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  thumbInner: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
});

export const SearchScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.match);

  const [ageRange, setAgeRange] = useState({ min: filters.minAge, max: filters.maxAge });
  const [selectedCity, setSelectedCity] = useState(filters.city);
  const [citySearch, setCitySearch] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Cities logic
  const [cities, setCities] = useState<any[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  useEffect(() => {
    // Load persisted filters on mount
    dispatch(loadFilters());
    fetchCities();
  }, [dispatch]);

  // Sync state with filters when they change (e.g. after loadFilters)
  useEffect(() => {
    setAgeRange({ min: filters.minAge, max: filters.maxAge });
    setSelectedCity(filters.city);
  }, [filters]);

  const fetchCities = async () => {
    setCitiesLoading(true);
    try {
      const response = await api.post('/cities', { limit: 100000 });
      if (response.data?.data?.cities) {
        setCities(response.data.data.cities);
      }
    } catch (error) {
      console.log('Error fetching cities', error);
    } finally {
      setCitiesLoading(false);
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    (city.state && city.state.toLowerCase().includes(citySearch.toLowerCase()))
  );

  const handleSearch = async () => {
    // 1. Save filters to Redux & Storage
    await dispatch(updateFilters({
      minAge: ageRange.min,
      maxAge: ageRange.max,
      city: selectedCity,
    }));

    // 2. Fetch new users
    dispatch(getRandomUsers());

    // 3. Navigate
    navigate('matches');
  };

  const handleReset = () => {
    dispatch(resetFilters());
    // Local state will update via useEffect
  };

  const handleCitySelect = (city: any) => {
    setSelectedCity(city.name);
    setCitySearch('');
    setShowCityModal(false);
  };

  // Age slider handlers with validation
  const handleAgeMinChange = (value: number) => {
    setAgeRange(prev => ({
      ...prev,
      min: Math.min(value, prev.max - 1),
    }));
  };

  const handleAgeMaxChange = (value: number) => {
    setAgeRange(prev => ({
      ...prev,
      max: Math.max(value, prev.min + 1),
    }));
  };

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
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Search</Text>
          <Text style={styles.headerSubtitle}>Find your perfect match</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Age Range */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🎂</Text>
            <Text style={styles.sectionTitle}>Age range</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{ageRange.min} - {ageRange.max}</Text>
            </View>
          </View>

          {/* Min Age Slider */}
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Min</Text>
            <View style={styles.sliderWrapper}>
              <CustomSlider
                value={ageRange.min}
                min={18}
                max={60}
                onValueChange={handleAgeMinChange}
                sliderWidth={SLIDER_WIDTH}
              />
            </View>
            <Text style={styles.sliderValue}>{ageRange.min}</Text>
          </View>

          {/* Max Age Slider */}
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Max</Text>
            <View style={styles.sliderWrapper}>
              <CustomSlider
                value={ageRange.max}
                min={18}
                max={60}
                onValueChange={handleAgeMaxChange}
                sliderWidth={SLIDER_WIDTH}
              />
            </View>
            <Text style={styles.sliderValue}>{ageRange.max}</Text>
          </View>

          <View style={styles.sliderLabelsRow}>
            <Text style={styles.sliderLabelText}>18</Text>
            <Text style={styles.sliderLabelText}>60</Text>
          </View>
        </View>

        {/* City Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏙️</Text>
            <Text style={styles.sectionTitle}>City</Text>
            {selectedCity ? (
              <TouchableOpacity onPress={() => setSelectedCity('')}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.citySelector}
            onPress={() => setShowCityModal(true)}
            activeOpacity={0.8}>
            <Text style={selectedCity ? styles.citySelectedText : styles.cityPlaceholder}>
              {selectedCity || 'Select city (optional)'}
            </Text>
            <Text style={styles.cityArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.9}>
          <LinearGradient
            colors={colors.gradient.primary as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchGradient}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchButtonText}>Find Matches</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Results Info */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            <Text style={styles.resultsHighlight}>2,847</Text> people match your criteria
          </Text>
        </View>
      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.cityModalOverlay}>
          <View style={styles.cityModalContent}>
            {/* Modal Header */}
            <View style={styles.cityModalHeader}>
              <Text style={styles.cityModalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.cityModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.citySearchContainer}>
              <Text style={styles.citySearchIcon}>🔍</Text>
              <TextInput
                style={styles.citySearchInput}
                placeholder="Search city..."
                placeholderTextColor={colors.text.quaternary}
                value={citySearch}
                onChangeText={setCitySearch}
                autoFocus
              />
              {citySearch ? (
                <TouchableOpacity onPress={() => setCitySearch('')}>
                  <Text style={styles.citySearchClear}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>



            {/* City List */}
            {/* City List */}
            {/* City List */}
            {citiesLoading ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="small" color={colors.brand.primary} />
              </View>
            ) : (
              <FlatList
                data={filteredCities}
                keyExtractor={(item, index) => item._id || String(index)}
                style={styles.cityList}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={10}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View style={styles.noCityResult}>
                    <Text style={styles.noCityText}>No cities found</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityOption}
                    onPress={() => handleCitySelect(item)}
                    activeOpacity={0.7}>
                    <Text style={styles.cityOptionIcon}>📍</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cityOptionText}>{item.name}</Text>
                      {item.state && <Text style={{ fontSize: 12, color: colors.text.tertiary }}>{item.state}</Text>}
                    </View>
                    {selectedCity === item.name && <Text style={styles.cityOptionCheck}>✓</Text>}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Sidebar Modal */}
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
    top: -50,
    right: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.brand.primaryMuted,
    opacity: 0.3,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.brand.accentMuted,
    opacity: 0.2,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ui.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.text.primary,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  resetButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  resetText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.brand.primary,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[10],
  },

  // Section
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  valueContainer: {
    backgroundColor: colors.brand.primaryMuted,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.badge,
  },
  valueText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },

  // Options Grid
  optionsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.ui.border,
    position: 'relative',
  },
  optionCardActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primaryMuted,
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  optionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.secondary,
  },
  optionLabelActive: {
    color: colors.brand.primary,
  },
  checkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  checkIcon: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: typography.weight.bold,
  },

  // Slider Styles
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  sliderLabel: {
    width: 35,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
  },
  sliderWrapper: {
    flex: 1,
  },
  sliderValue: {
    width: 35,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
    textAlign: 'right',
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[1],
    marginTop: spacing[1],
  },
  sliderLabelText: {
    fontSize: typography.size.xs,
    color: colors.text.quaternary,
  },

  // City Selector
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  cityPlaceholder: {
    fontSize: typography.size.base,
    color: colors.text.quaternary,
  },
  citySelectedText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  cityArrow: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  clearText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.brand.primary,
  },

  // City Modal
  cityModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  cityModalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: spacing[8],
  },
  cityModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  cityModalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  cityModalClose: {
    fontSize: 20,
    color: colors.text.tertiary,
    padding: spacing[2],
  },
  citySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing[5],
    marginVertical: spacing[4],
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  citySearchIcon: {
    fontSize: 16,
  },
  citySearchInput: {
    flex: 1,
    height: 48,
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  citySearchClear: {
    fontSize: 16,
    color: colors.text.tertiary,
    padding: spacing[2],
  },
  cityList: {
    paddingHorizontal: spacing[5],
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
    gap: spacing[3],
  },
  cityOptionIcon: {
    fontSize: 18,
  },
  cityOptionText: {
    fontSize: typography.size.base,
    color: colors.text.primary,
  },
  cityOptionCheck: {
    fontSize: 18,
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  noCityResult: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  noCityText: {
    fontSize: typography.size.base,
    color: colors.text.tertiary,
  },

  // Toggle Card
  toggleCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  toggleIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  toggleTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
  },
  toggleSubtitle: {
    fontSize: typography.size.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  toggleDivider: {
    height: 1,
    backgroundColor: colors.ui.divider,
    marginVertical: spacing[4],
  },

  // Search Button
  searchButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    marginTop: spacing[4],
    ...shadows.primaryGlow,
  },
  searchGradient: {
    flexDirection: 'row',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  searchIcon: {
    fontSize: 20,
  },
  searchButtonText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    letterSpacing: typography.tracking.wide,
  },

  // Results Info
  resultsInfo: {
    alignItems: 'center',
    marginTop: spacing[5],
  },
  resultsText: {
    fontSize: typography.size.sm,
    color: colors.text.tertiary,
  },
  resultsHighlight: {
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },

  // Modal
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
    ...shadows.xl,
  },
});

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
    Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';
import api from '../services/api';

// Custom decorative icon
const MapDecor: React.FC = () => (
    <View style={styles.mapDecorContainer}>
        <Text style={styles.mapDecorIcon}>🗺️</Text>
    </View>
);

export const AddressScreen: React.FC = () => {
    const { navigate, goBack } = useNavigation();
    const dispatch = useAppDispatch();
    const { registrationDraft } = useAppSelector(state => state.auth);

    const [cities, setCities] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCityId, setSelectedCityId] = useState<string | null>(registrationDraft.address || null);
    const [selectedCityName, setSelectedCityName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Animation values
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(50)).current;

    useEffect(() => {
        fetchCities();
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

    const fetchCities = async () => {
        try {
            const response = await api.post('/cities', { limit: 100000 });
            if (response.data?.data?.cities) {
                const fetchedCities = response.data.data.cities;
                setCities(fetchedCities);

                // If we have a saved address in draft
                if (registrationDraft.address) {
                    const found = fetchedCities.find((c: any) => c._id === registrationDraft.address);
                    if (found) {
                        setSelectedCityName(found.name);
                        setSelectedCityId(found._id);
                    } else {
                        // Fallback match by name
                        const foundByName = fetchedCities.find((c: any) => c.name === registrationDraft.address);
                        if (foundByName) {
                            setSelectedCityId(foundByName._id);
                            setSelectedCityName(foundByName.name);
                        } else {
                            setSelectedCityName(registrationDraft.address || '');
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Error fetching cities', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (city.state && city.state.toLowerCase().includes(searchText.toLowerCase()))
    );

    const handleSelectCity = (city: any) => {
        setSelectedCityId(city._id);
        setSelectedCityName(city.name);
        setIsModalVisible(false);
        setSearchText('');
    };

    const handleNext = async () => {
        if (selectedCityId) {
            await dispatch(saveDraft({ address: selectedCityId }));
            navigate('interests');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

            <LinearGradient
                colors={colors.gradient.dark as [string, string, string]}
                style={styles.backgroundGradient}
            />

            {/* Decorative Background */}
            <MapDecor />

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.header}>
                    <BackButton onPress={goBack} variant="default" />
                    <View style={styles.stepBadge}>
                        <Text style={styles.stepText}>6 / 9</Text>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Find your vibe 🌍</Text>
                    <Text style={styles.subtitle}>
                        Connect with people near you by selecting your city.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.searchTrigger}
                    onPress={() => setIsModalVisible(true)}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={[colors.background.tertiary, colors.ui.overlay]}
                        style={styles.searchTriggerGradient}
                    >
                        <View style={styles.searchIconContainer}>
                            <Text style={styles.searchPreIcon}>📍</Text>
                        </View>
                        <View style={styles.searchTextContainer}>
                            <Text style={styles.searchLabel}>Current Location</Text>
                            <Text style={[styles.searchValue, !selectedCityName && styles.placeholderValue]}>
                                {selectedCityName || 'Select City...'}
                            </Text>
                        </View>
                        <View style={styles.searchArrowContainer}>
                            <Text style={styles.searchArrow}>→</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, !selectedCityId && styles.nextButtonDisabled]}
                        onPress={handleNext}
                        disabled={!selectedCityId}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedCityId ? colors.gradient.primary as [string, string] : [colors.ui.border, colors.ui.border]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>CONTINUE</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* City Selection Modal */}
            {/* ... Modal Logic remains similar, just keeping it consistent ... */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                {/* ... (Same modal content, maybe refine styles slightly in next step if needed or just keep current logic) ... */}
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Search City</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchBox}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Type city name..."
                                placeholderTextColor={colors.text.tertiary}
                                value={searchText}
                                onChangeText={setSearchText}
                                autoFocus
                            />
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color={colors.brand.primary} style={{ marginTop: 40 }} />
                        ) : (
                            <FlatList
                                data={filteredCities}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.cityItem}
                                        onPress={() => handleSelectCity(item)}
                                    >
                                        <View style={styles.cityIconContainer}>
                                            <Text style={styles.cityIcon}>🏙️</Text>
                                        </View>
                                        <View style={styles.cityInfo}>
                                            <Text style={[styles.cityText, item._id === selectedCityId && styles.cityTextSelected]}>
                                                {item.name}
                                            </Text>
                                            {item.state ? <Text style={styles.stateText}>{item.state}</Text> : null}
                                        </View>
                                        {item._id === selectedCityId && (
                                            <Text style={styles.checkIcon}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={styles.listContent}
                                keyboardShouldPersistTaps="handled"
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>No cities found</Text>
                                }
                            />
                        )}
                    </View>
                </SafeAreaView>
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
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    },
    mapDecorContainer: {
        position: 'absolute',
        top: '15%',
        alignSelf: 'center',
        opacity: 0.1,
        transform: [{ scale: 2 }],
    },
    mapDecorIcon: {
        fontSize: 150,
        color: colors.brand.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing[6],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing[4],
        marginBottom: spacing[6],
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
        marginBottom: 40,
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
    searchTrigger: {
        borderRadius: 16,
        ...shadows.lg,
    },
    searchTriggerGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    searchIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.background.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    searchPreIcon: {
        fontSize: 24,
    },
    searchTextContainer: {
        flex: 1,
    },
    searchLabel: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    searchValue: {
        fontSize: 18,
        color: colors.text.primary,
        fontWeight: '600',
    },
    placeholderValue: {
        color: colors.text.tertiary,
        fontStyle: 'italic',
    },
    searchArrowContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.ui.overlay,
        borderRadius: 16,
    },
    searchArrow: {
        fontSize: 16,
        color: colors.text.secondary,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    nextButton: {
        borderRadius: 28, // Pill shape
        overflow: 'hidden',
        ...shadows.primaryGlow,
    },
    nextButtonDisabled: {
        backgroundColor: colors.ui.border,
        opacity: 0.5,
        elevation: 0,
        shadowOpacity: 0,
    },
    nextButtonGradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        letterSpacing: 2,
    },

    // Modal
    modalContainer: { flex: 1, backgroundColor: colors.background.primary },
    modalContent: { flex: 1 },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.border,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary },
    closeButton: { padding: 8 },
    closeButtonIcon: { fontSize: 20, color: colors.text.secondary },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        margin: 20,
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.ui.border,
    },
    searchIcon: { fontSize: 20, color: colors.text.disabled, marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: colors.text.primary, height: '100%' },
    listContent: { paddingBottom: 40 },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.divider,
    },
    cityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.ui.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cityIcon: { fontSize: 18 },
    cityInfo: { flex: 1 },
    cityText: { fontSize: 16, color: colors.text.secondary, fontWeight: '500' },
    cityTextSelected: { color: colors.brand.primary, fontWeight: 'bold' },
    stateText: { fontSize: 13, color: colors.text.tertiary, marginTop: 2 },
    checkIcon: { color: colors.brand.primary, fontSize: 18, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, color: colors.text.tertiary, fontSize: 16 },
});

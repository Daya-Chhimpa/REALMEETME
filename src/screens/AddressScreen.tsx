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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';
import api from '../services/api';

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

    useEffect(() => {
        fetchCities();
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
        city.name.toLowerCase().includes(searchText.toLowerCase())
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

            <View style={styles.content}>
                <View style={styles.header}>
                    <BackButton onPress={goBack} variant="default" />
                    <Text style={styles.stepIndicator}>Step 6 of 9</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Where do you live?</Text>
                    <Text style={styles.subtitle}>Select your city or region to find matches near you.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address / Location</Text>

                    {/* Trigger Button */}
                    <TouchableOpacity
                        style={styles.triggerButton}
                        onPress={() => setIsModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.triggerText, !selectedCityName && styles.placeholderText]}>
                            {selectedCityName || 'Select your city...'}
                        </Text>
                        <Text style={styles.triggerIcon}>▼</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, !selectedCityId && styles.nextButtonDisabled]}
                        onPress={handleNext}
                        disabled={!selectedCityId}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={selectedCityId ? colors.gradient.primary as [string, string] : [colors.background.tertiary, colors.background.tertiary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={[styles.nextButtonText, !selectedCityId && styles.nextButtonTextDisabled]}>
                                CONTINUE
                            </Text>
                            <Text style={[styles.nextButtonArrow, !selectedCityId && styles.nextButtonTextDisabled]}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* City Selection Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select City</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchBox}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Search city..."
                                placeholderTextColor={colors.text.tertiary}
                                value={searchText}
                                onChangeText={setSearchText}
                                autoFocus
                            />
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color={colors.brand.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <FlatList
                                data={filteredCities}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.cityItem}
                                        onPress={() => handleSelectCity(item)}
                                    >
                                        <Text style={[
                                            styles.cityText,
                                            item._id === selectedCityId && styles.cityTextSelected
                                        ]}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.stateText}>{item.state}</Text>
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
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
    stepIndicator: {
        fontSize: typography.size.sm,
        color: colors.text.tertiary,
        fontWeight: typography.weight.medium,
    },
    titleContainer: {
        marginBottom: spacing[8],
    },
    title: {
        fontSize: typography.size['3xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    subtitle: {
        fontSize: typography.size.lg,
        color: colors.text.secondary,
        lineHeight: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.brand.primary,
        marginBottom: spacing[2],
        marginLeft: spacing[1],
        letterSpacing: 1,
    },
    triggerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.ui.border,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        height: 56,
    },
    triggerText: {
        fontSize: typography.size.lg,
        color: colors.text.primary,
    },
    placeholderText: {
        color: colors.text.tertiary,
    },
    triggerIcon: {
        fontSize: 14,
        color: colors.text.tertiary,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: spacing[8],
    },
    nextButton: {
        borderRadius: borderRadius.button,
        overflow: 'hidden',
        ...shadows.primaryGlow,
    },
    nextButtonDisabled: {
        elevation: 0,
        shadowOpacity: 0,
        opacity: 0.8,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
    },
    nextButtonText: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: typography.tracking.wider,
    },
    nextButtonTextDisabled: {
        color: colors.text.quaternary,
    },
    nextButtonArrow: {
        fontSize: typography.size.lg,
        color: colors.text.primary,
        fontWeight: typography.weight.bold,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    modalContent: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center title
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.ui.border,
        position: 'relative',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 16,
        bottom: 16,
        justifyContent: 'center',
    },
    closeButtonText: {
        color: colors.brand.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.md,
        margin: 16,
        paddingHorizontal: 12,
        height: 50,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 10,
        color: colors.text.tertiary,
    },
    input: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 16,
        height: '100%',
    },
    activeInput: {
        // ... if needed
    },
    listContent: {
        paddingBottom: 40,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    cityText: {
        fontSize: 16,
        color: colors.text.secondary,
        marginRight: 8,
    },
    cityTextSelected: {
        color: colors.brand.primary,
        fontWeight: 'bold',
    },
    stateText: {
        fontSize: 14,
        color: colors.text.tertiary,
        flex: 1,
    },
    checkIcon: {
        color: colors.brand.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
});

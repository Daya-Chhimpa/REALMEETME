import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Text,
    Dimensions,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import { colors, shadows, spacing } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Interest {
    _id: string;
    name: string;
}

export const InterestsScreen: React.FC = () => {

    const { navigate, goBack } = useNavigation();
    const dispatch = useAppDispatch();
    const { registrationDraft } = useAppSelector(state => state.auth);

    const [interests, setInterests] = useState<Interest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize with previously selected interests or empty array
    // Note: This expects IDs if available, or might contain names from legacy code.
    // Ideally we'd validte against available interests but we fetch them async.
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        registrationDraft?.interests || []
    );

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await api.get('/interests');
                console.log('Interests response:', response.data);
                if (response.data?.status && Array.isArray(response.data.data)) {
                    setInterests(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch interests', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterests();
    }, []);

    const toggleInterest = (interestId: string) => {
        if (selectedInterests.includes(interestId)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interestId));
        } else {
            setSelectedInterests([...selectedInterests, interestId]);
        }
    };

    const handleNext = async () => {
        // Save the array of IDs
        await dispatch(saveDraft({ interests: selectedInterests }));
        navigate('photos');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
            <View style={styles.gradientBackground} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <BackButton onPress={goBack} variant="default" style={{ marginBottom: spacing[4] }} />
                    <Text style={styles.title}>Your interests</Text>
                    <Text style={styles.subtitle}>
                        Select a few of your interests and let everyone know what you're passionate about.
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.brand.primary} />
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.interestsContainer}>
                            {interests.length > 0 ? (
                                interests.map((interest) => {
                                    const isSelected = selectedInterests.includes(interest._id);
                                    return (
                                        <TouchableOpacity
                                            key={interest._id}
                                            style={[
                                                styles.chip,
                                                isSelected && styles.chipSelected
                                            ]}
                                            onPress={() => toggleInterest(interest._id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                isSelected && styles.chipTextSelected
                                            ]}>
                                                {interest.name}
                                            </Text>
                                            {isSelected && (
                                                <View style={styles.checkIcon}>
                                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text style={styles.noDataText}>No interests found.</Text>
                            )}
                        </View>
                    </ScrollView>
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, selectedInterests.length === 0 && { opacity: 0.5 }]}
                        onPress={handleNext}
                        activeOpacity={0.8}
                        disabled={selectedInterests.length === 0}
                    >
                        <LinearGradient
                            colors={
                                selectedInterests.length > 0
                                    ? (colors.gradient.primary as [string, string])
                                    : [colors.ui.borderDark, colors.ui.borderDark]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>
                                NEXT
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: Math.min(28, SCREEN_WIDTH * 0.08),
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text.tertiary,
        lineHeight: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 99,
        borderWidth: 1.5,
        borderColor: colors.ui.border,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    chipSelected: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
        ...shadows.primaryGlow,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.secondary,
    },
    chipTextSelected: {
        color: 'white',
    },
    checkIcon: {
        marginLeft: 6,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 10,
    },
    nextButton: {
        borderRadius: 12,
        overflow: 'hidden',
        height: Math.max(50, SCREEN_WIDTH * 0.13),
        ...shadows.primaryGlow,
    },
    nextButtonGradient: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: colors.text.secondary,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    }
});

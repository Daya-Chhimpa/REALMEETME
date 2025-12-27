import React, { useState } from 'react';
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
} from 'react-native';

import { colors, shadows, spacing } from '../theme/colors';
import { BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveDraft } from '../redux/slices/authSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTERESTS = [
    'Photography',
    'Shopping',
    'Karaoke',
    'Yoga',
    'Cooking',
    'Tennis',
    'Run',
    'Swimming',
    'Art',
    'Traveling',
    'Extreme',
    'Music',
    'Drink',
    'Video games',
    'Gaming',
    'Hiking',
    'Foodie',
    'Fashion',
    'Books',
    'Movies'
];

export const InterestsScreen: React.FC = () => {
    const { navigate, goBack } = useNavigation();
    const dispatch = useAppDispatch();
    const { registrationDraft } = useAppSelector(state => state.auth);

    // Initialize with previously selected interests or empty array
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        registrationDraft?.interests || []
    );

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleNext = () => {
        dispatch(saveDraft({ interests: selectedInterests }));
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

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.interestsContainer}>
                        {INTERESTS.map((interest) => {
                            const isSelected = selectedInterests.includes(interest);
                            return (
                                <TouchableOpacity
                                    key={interest}
                                    style={[
                                        styles.chip,
                                        isSelected && styles.chipSelected
                                    ]}
                                    onPress={() => toggleInterest(interest)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        isSelected && styles.chipTextSelected
                                    ]}>
                                        {interest}
                                    </Text>
                                    {isSelected && (
                                        <View style={styles.checkIcon}>
                                            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton]} // Always enabled, even if none selected? User said "multiple select kr skta h" implies optional or at least 1? Usually standard is optional or 1+. I'll allow 0 for now unless requested.
                        onPress={handleNext}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={
                                selectedInterests.length > 0
                                    ? (colors.gradient.primary as [string, string])
                                    : [colors.ui.borderDark, colors.ui.borderDark] // Disabled look if 0? Or just allow next? 
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={styles.nextButtonText}>
                                {selectedInterests.length > 0 ? 'NEXT' : 'SKIP'}
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
});

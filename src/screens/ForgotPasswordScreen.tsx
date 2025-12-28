import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, shadows, borderRadius, typography, spacing } from '../theme/colors';
import { Input, BackButton } from '../components';
import { useNavigation } from '../navigation/NavigationContext';
import { useAppDispatch } from '../redux/hooks';
import { forgotPassword } from '../redux/slices/authSlice';
import { Toast, ToastType } from '../components/Toast';

export const ForgotPasswordScreen: React.FC = () => {
    const { navigate, goBack } = useNavigation();
    const dispatch = useAppDispatch();

    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const handleSendOTP = async () => {
        if (!phone || phone.length < 10) {
            setToast({ visible: true, message: 'Please enter a valid mobile number', type: 'error' });
            return;
        }

        setIsLoading(true);
        const formattedMobile = phone.startsWith('+') ? phone : `+91${phone}`;

        try {
            const resultAction = await dispatch(forgotPassword(formattedMobile));
            if (forgotPassword.fulfilled.match(resultAction)) {
                setToast({ visible: true, message: 'OTP sent successfully!', type: 'success' });
                setTimeout(() => {
                    // We need a way to pass mobile to the next screen. 
                    // Since our simple nav context doesn't pass params, we might need to store it in Redux or just rely on user re-entering?
                    // Or, we can use a temporary redux state field for "forgotPasswordMobile".
                    // For now, I'll assume the Reset screen might ask for mobile again OR we rely on the component param workaround if I could mod NavContext... 
                    // But I can't easily mod NavContext to support params right now without breaking everything.
                    // I will assume the user has to re-enter mobile OR I'll add a 'registrationDraft' like field for 'forgotPasswordDraft' later if needed.
                    // Actually, let's just dispatch an action to save it if we had one? 
                    // No, let's keep it simple. The reset screen asks for mobile, otp, password. 
                    // Alternatively, I can just make a global var or context change.
                    // Let's stick to the UI flow. The reset screen typically asks for OTP. It probably needs the mobile number to verify against.
                    // I'll update the ResetScreen to accept mobile input as well, pre-filled if possible, but simplest is let user type it or use state.
                    // Actually, since I can't pass params, I will ask user to confirm mobile on next screen or just assume the user knows.
                    navigate('forgotreset');
                }, 1000);
            } else {
                if (forgotPassword.rejected.match(resultAction)) {
                    setToast({
                        visible: true,
                        message: (resultAction.payload as string) || 'Failed to send OTP',
                        type: 'error'
                    });
                }
            }
        } catch (error: any) {
            setToast({ visible: true, message: 'An unexpected error occurred', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />

            <LinearGradient
                colors={colors.gradient.dark as [string, string, string]}
                style={styles.backgroundGradient}
            />

            {/* Decorative Elements */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <BackButton onPress={goBack} variant="default" />

                    <View style={styles.header}>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            Don't worry! It happens. Please enter the mobile number associated with your account.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.phoneContainer}>
                                <TouchableOpacity style={styles.countryCode}>
                                    <Text style={styles.countryFlag}>🇮🇳</Text>
                                    <Text style={styles.countryCodeText}>+91</Text>
                                    <Text style={styles.dropdownIcon}>▼</Text>
                                </TouchableOpacity>
                                <View style={styles.phoneInputWrapper}>
                                    <Input
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        autoFocus
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSendOTP}
                            activeOpacity={0.9}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={colors.gradient.primary as [string, string]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitGradient}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isLoading ? 'SENDING...' : 'SEND OTP'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
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
        top: -80,
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing[6],
        paddingBottom: spacing[8],
    },
    header: {
        marginTop: spacing[6],
        marginBottom: spacing[8],
    },
    title: {
        fontSize: typography.size['3xl'],
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    subtitle: {
        fontSize: typography.size.base,
        color: colors.text.tertiary,
        lineHeight: 24,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: spacing[6],
    },
    label: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        color: colors.text.secondary,
        marginBottom: spacing[3],
        letterSpacing: typography.tracking.wide,
        textTransform: 'uppercase',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[3],
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.ui.border,
        paddingHorizontal: spacing[3],
        height: 56,
        gap: spacing[2],
    },
    countryFlag: {
        fontSize: 20,
    },
    countryCodeText: {
        fontSize: typography.size.base,
        fontWeight: typography.weight.semibold,
        color: colors.text.primary,
    },
    dropdownIcon: {
        fontSize: 10,
        color: colors.text.tertiary,
    },
    phoneInputWrapper: {
        flex: 1,
    },
    submitButton: {
        borderRadius: borderRadius.button,
        overflow: 'hidden',
        ...shadows.primaryGlow,
    },
    submitGradient: {
        paddingVertical: spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        letterSpacing: typography.tracking.wider,
    },
});

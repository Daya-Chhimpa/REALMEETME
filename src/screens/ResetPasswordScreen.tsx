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
import { resetPassword } from '../redux/slices/authSlice';
import { Toast, ToastType } from '../components/Toast';

export const ResetPasswordScreen: React.FC = () => {
    const { navigate, goBack } = useNavigation();
    const dispatch = useAppDispatch();

    // Since we can't easily pass params in this simple nav setup, we ask for phone again or user re-enters
    // Ideally we'd pull from a store or context. For now, manual entry is safer than implementing a new complexity.
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const handleResetPassword = async () => {
        if (!phone || phone.length < 10) {
            setToast({ visible: true, message: 'Please enter valid mobile number', type: 'error' });
            return;
        }
        if (!otp || otp.length < 4) {
            setToast({ visible: true, message: 'Please enter a valid OTP', type: 'error' });
            return;
        }
        if (password.length < 6) {
            setToast({ visible: true, message: 'Password must be at least 6 characters', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setToast({ visible: true, message: 'Passwords do not match', type: 'error' });
            return;
        }

        setIsLoading(true);
        const formattedMobile = phone.startsWith('+') ? phone : `+91${phone}`;

        try {
            const resultAction = await dispatch(resetPassword({
                mobile: formattedMobile,
                otp,
                password
            }));

            if (resetPassword.fulfilled.match(resultAction)) {
                setToast({ visible: true, message: 'Password reset successful!', type: 'success' });
                setTimeout(() => {
                    navigate('login');
                }, 1500);
            } else {
                if (resetPassword.rejected.match(resultAction)) {
                    setToast({
                        visible: true,
                        message: (resultAction.payload as string) || 'Failed to reset password',
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
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Enter the OTP sent to your mobile number and set a new password.
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Mobile - to ensure we target right user */}
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
                                        placeholder="Mobile number"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Input
                                label="OTP"
                                placeholder="Enter OTP"
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Input
                                label="New Password"
                                placeholder="Enter new password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                rightIcon={<Text style={{ fontSize: 20 }}>{!showPassword ? '👁️' : '🔒'}</Text>}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Input
                                label="Confirm Password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                rightIcon={<Text style={{ fontSize: 20 }}>{!showPassword ? '👁️' : '🔒'}</Text>}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleResetPassword}
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
                                    {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
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
        marginBottom: spacing[5],
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
        marginTop: spacing[2],
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

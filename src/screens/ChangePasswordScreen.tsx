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
import { changePassword } from '../redux/slices/authSlice';
import { Toast, ToastType } from '../components/Toast';

export const ChangePasswordScreen: React.FC = () => {
    const { goBack } = useNavigation();
    const dispatch = useAppDispatch();

    const [oldPassword, setOldPassword] = useState('');
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

    const handleChangePassword = async () => {
        if (!oldPassword) {
            setToast({ visible: true, message: 'Please enter current password', type: 'error' });
            return;
        }
        if (password.length < 6) {
            setToast({ visible: true, message: 'New password must be at least 6 characters', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setToast({ visible: true, message: 'New passwords do not match', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const resultAction = await dispatch(changePassword({
                oldPassword,
                password
            }));

            if (changePassword.fulfilled.match(resultAction)) {
                setToast({ visible: true, message: 'Password changed successfully!', type: 'success' });
                setTimeout(() => {
                    goBack();
                }, 1500);
            } else {
                if (changePassword.rejected.match(resultAction)) {
                    setToast({
                        visible: true,
                        message: (resultAction.payload as string) || 'Failed to change password',
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerRow}>
                        <BackButton onPress={goBack} variant="default" />
                        <Text style={styles.headerTitle}>Change Password</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Input
                                label="Current Password"
                                placeholder="Enter current password"
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Input
                                label="New Password"
                                placeholder="Enter new password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                rightIcon={<Text style={{ fontSize: 20 }}>{showPassword ? '👁️' : '🔒'}</Text>}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Input
                                label="Confirm New Password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleChangePassword}
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
                                    {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing[6],
        paddingBottom: spacing[8],
        paddingTop: spacing[6],
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[8],
    },
    headerTitle: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: spacing[5],
    },
    submitButton: {
        borderRadius: borderRadius.button,
        overflow: 'hidden',
        marginTop: spacing[4],
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

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { colors, shadows, spacing, typography } from '../theme/colors';

const { width } = Dimensions.get('window');
const TOAST_WIDTH = width * 0.9;

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    onHide?: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'success',
    onHide,
    duration = 3000,
}) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [show, setShow] = useState(visible);

    useEffect(() => {
        if (visible) {
            setShow(true);
            // Entrance animation
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: Platform.OS === 'ios' ? 60 : 40, // Adjust for status bar
                    useNativeDriver: true,
                    friction: 8,
                    tension: 40,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide
            if (duration > 0) {
                const timer = setTimeout(() => {
                    hideToast();
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShow(false);
            if (onHide && visible) onHide();
        });
    };

    if (!show) return null;

    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: colors.background.elevated,
                    border: colors.accent.green,
                    title: colors.accent.green,
                    gradient: colors.accent.greenGlow,
                };
            case 'error':
                return {
                    bg: colors.background.elevated,
                    border: colors.accent.red,
                    title: colors.accent.red,
                    gradient: colors.accent.redGlow,
                };
            default:
                return {
                    bg: colors.background.elevated,
                    border: colors.brand.primary,
                    title: colors.brand.primary,
                    gradient: colors.shadows.primaryGlow.shadowColor,
                };
        }
    };

    const theme = getColors();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    shadowColor: theme.gradient,
                },
            ]}>
            <TouchableWithoutFeedback onPress={hideToast}>
                <View style={styles.content}>
                    <View style={[styles.indicator, { backgroundColor: theme.border }]} />
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme.title }]}>
                            {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}
                        </Text>
                        <Text style={styles.message} numberOfLines={2}>
                            {message}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        width: TOAST_WIDTH,
        minHeight: 60,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    indicator: {
        width: 4,
        height: 32,
        borderRadius: 2,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
    },
});

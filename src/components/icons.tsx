import React from 'react';
import { View } from 'react-native';

export const EyeIcon = ({ color = '#000', size = 24 }: { color?: string; size?: number }) => {
    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            {/* Eye Body - Almond shape */}
            <View
                style={{
                    width: size * 0.70,
                    height: size * 0.70,
                    borderWidth: size * 0.08,
                    borderColor: color,
                    backgroundColor: 'transparent',
                    // Make Top-Left and Bottom-Right sharp for horizontal points after -45deg rotation
                    borderTopLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: size * 0.7,
                    borderBottomLeftRadius: size * 0.7,
                    transform: [{ rotate: '-45deg' }],
                }}
            />
            {/* Pupil */}
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.28,
                    height: size * 0.28,
                    backgroundColor: color,
                    borderRadius: size * 0.14,
                }}
            />
        </View>
    );
};

export const EyeOffIcon = ({ color = '#000', size = 24 }: { color?: string; size?: number }) => {
    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            {/* Eye Body */}
            <View
                style={{
                    width: size * 0.70,
                    height: size * 0.70,
                    borderWidth: size * 0.08,
                    borderColor: color,
                    backgroundColor: 'transparent',
                    borderTopLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: size * 0.7,
                    borderBottomLeftRadius: size * 0.7,
                    transform: [{ rotate: '-45deg' }],
                    opacity: 0.6
                }}
            />
            {/* Pupil */}
            <View
                style={{
                    position: 'absolute',
                    width: size * 0.28,
                    height: size * 0.28,
                    backgroundColor: color,
                    borderRadius: size * 0.14,
                    opacity: 0.6
                }}
            />
            {/* Slash */}
            <View
                style={{
                    width: size * 0.08,
                    height: size * 1.1,
                    backgroundColor: color,
                    position: 'absolute',
                    transform: [{ rotate: '45deg' }],
                    borderWidth: 1.5,
                    borderColor: '#ffffff', // Match likely background or handle prop logic later
                    borderRadius: 2
                }}
            />
        </View>
    );
};

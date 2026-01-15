import React, { useState } from 'react';
import { Animated, Easing } from 'react-native';

export const FloatingHeart = ({ onComplete, style }: { onComplete: () => void, style?: any }) => {
    const [animation] = useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 1,
                duration: 800, // Faster duration (was 1500)
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
        ]).start(({ finished }) => {
            if (finished) onComplete();
        });
    }, []);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -400], // Float up higher and faster
    });

    const opacity = animation.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [1, 1, 0],
    });

    const scale = animation.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0.5, 1.5, 1], // Pulse effect
    });

    return (
        <Animated.Text style={[{
            position: 'absolute',
            bottom: 100, // Start near action buttons
            fontSize: 40,
            color: '#A020F0', // Purple/Pink heart
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        }, {
            opacity,
            transform: [{ translateY }, { scale }]
        }, style]}>
            🩷
        </Animated.Text>
    );
};

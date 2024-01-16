// ShootingStar.tsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const ShootingStar = ({ duration, delay, style, onComplete }: any) => {
    const translateX = useRef(new Animated.Value(-50)).current;
    const translateY = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(translateX, {
                toValue: 1.2, // Adjust this value based on your layout
                duration: duration,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 1.2, // Adjust this value based on your layout
                duration: 0, // Set to 0 to ensure only the X translation occurs
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Call the onComplete callback when the animation is complete
            onComplete();
        });
    }, [translateX, translateY, duration, delay, onComplete]);

    return (
        <Animated.View
            style={[
                styles.shootingStar,
                style,
                {
                    transform: [
                        { translateX: translateX },
                        { translateY: translateY },
                    ],
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    shootingStar: {
        position: 'absolute',
        width: 3,
        height: 15,
        backgroundColor: '#ffffff', // Adjust color as needed
        borderRadius: 2,
    },
});

export default ShootingStar;

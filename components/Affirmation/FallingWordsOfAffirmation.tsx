import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const FallingWordsOfAffirmation = ({ affirmations }: any) => {
    const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
    const translateY = new Animated.Value(50);
    const opacity = new Animated.Value(1);

    useEffect(() => {
        if (currentAffirmationIndex < affirmations.length) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 850,
                    duration: 8000,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0.5,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                setCurrentAffirmationIndex((prevIndex) => prevIndex + 1);
                translateY.setValue(-50);
            });
        }
    }, [currentAffirmationIndex, affirmations, translateY, opacity]);

    return (
        <View style={styles.container}>
            {affirmations.map((affirmation: string, index: number) => (
                <Animated.Text
                    key={index}
                    style={[
                        styles.text,
                        {
                            transform: [{ translateY }],
                            opacity: index === currentAffirmationIndex ? opacity : 0,
                        },
                    ]}
                >
                    {affirmation}
                </Animated.Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF69B4',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: -50,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        letterSpacing: 1,
        backgroundColor: 'rgba(255, 105, 180, 0.8)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
});

export default FallingWordsOfAffirmation;

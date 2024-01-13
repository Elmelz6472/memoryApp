import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const FallingWordsOfAffirmation = ({ affirmations }) => {
    const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
    const translateY = new Animated.Value(50);

    useEffect(() => {
        if (currentAffirmationIndex < affirmations.length) {
            Animated.timing(translateY, {
                toValue: 850, // Adjust the final position based on your preference
                duration: 8000, // Adjust the duration of the animation
                useNativeDriver: true,
            }).start(() => {
                // Move to the next affirmation after the animation is complete
                setCurrentAffirmationIndex((prevIndex) => prevIndex + 1);
                // Reset translateY for the next affirmation
                translateY.setValue(-50);
            });
        }
    }, [currentAffirmationIndex, affirmations, translateY]);

    return (
        <View style={styles.container}>
            {affirmations.map((affirmation, index) => (
                <Animated.Text
                    key={index}
                    style={[
                        styles.text,
                        {
                            transform: [{ translateY }],
                            opacity: index === currentAffirmationIndex ? 1 : 0, // Show only the current affirmation
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        top: -50, // Adjust the initial position based on your needs
    },
});

export default FallingWordsOfAffirmation;



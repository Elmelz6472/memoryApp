import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FallingWordsOfAffirmation from './FallingWordsOfAffirmation';
import HeartIcon from '../../heartIcon';
import AwesomeButton from 'react-native-really-awesome-button';
import affirmations from '../../affirmations/affirmations';
import shuffleArray from '../../utils/shuffleArray';

const Affirmations = () => {
    const [showAffirmations, setShowAffirmations] = useState(false);

    const handleShowAffirmations = () => {
        setShowAffirmations(!showAffirmations);
    };

    return (
        <View style={styles.container}>
            {showAffirmations && (
                <FallingWordsOfAffirmation
                    affirmations={shuffleArray([...affirmations])}
                />
            )}
            <View style={styles.buttonContainer}>
                <AwesomeButton onPress={handleShowAffirmations}
                backgroundColor="#FFB6C1" // Light Pink
                backgroundDarker="#FF69B4" // Darker Pink
                 style={styles.button}>
                    <Text style={styles.buttonText}>Show Affirmations</Text>
                    <HeartIcon width={20} height={20} color="red" />
                </AwesomeButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Align content at the bottom
        alignItems: 'center',
        backgroundColor: '#FF3366', // Romantic Pink
    },
    buttonContainer: {
        position: 'absolute',
        bottom: '10%',
        flexDirection: 'column', // Stack buttons vertically
        marginTop: 10, // Add margin between buttons
    },
    button: {
        zIndex: 10,
        backgroundColor: '#FF3366', // Romantic Pink
        borderRadius: 25,
        marginBottom: 10, // Add margin between buttons
        elevation: 5, // Add a subtle shadow for a cute effect
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
        textAlign: 'center',
    },
});

export default Affirmations;

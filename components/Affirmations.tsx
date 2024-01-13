import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FallingWordsOfAffirmation from './FallingWordsOfAffirmation';
import HeartIcon from '../heartIcon';
import AwesomeButton from 'react-native-really-awesome-button';
import { useNavigation } from '@react-navigation/native';
import affirmations from '../utils/affirmations';
import shuffleArray from '../utils/shuffleArray'

const Affirmations = () => {
    const navigation = useNavigation();
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
                <AwesomeButton onPress={handleShowAffirmations} style={styles.button}>
                    <Text style={styles.buttonText}>Show Affirmations</Text>
                    <HeartIcon width={20} height={20} color="white" />
                </AwesomeButton>
                <AwesomeButton onPress={() => { navigation.goBack()}} style={styles.button}>
                    <Text style={styles.buttonText}>Return back</Text>
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
        marginBottom: 20, // Add margin to provide space for the button
    },
    buttonContainer: {
        flexDirection: 'column', // Stack buttons vertically
        marginTop: 10, // Add margin between buttons
    },
    button: {
        padding: 15,
        borderRadius: 25,
        marginBottom: 10, // Add margin between buttons
        elevation: 5, // Add a subtle shadow for a cute effect
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10,
        textAlign: 'center'
    },
});

export default Affirmations;

// NightSkyBackdrop.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import StarsPattern from './StarPattern';

const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
    const onPress = () => {
        props.navigation.navigate('Letters');
    };

    const seed = 'ssss';

    return (
        <View style={styles.backdrop}>
            <View style={styles.centeredContainer}>
                <TouchableOpacity onPress={onPress} style={styles.button}>
                    <Text style={styles.buttonText}>Navigate to Letters</Text>
                </TouchableOpacity>
            </View>
            <StarsPattern seed={seed} />
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: '10%', // Adjust as needed for iOS bottom spacing
        width: '100%',
        zIndex: 10
    },
    button: {
        backgroundColor: '#FF4D4D', // Romantic red color
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NightSkyBackdrop;

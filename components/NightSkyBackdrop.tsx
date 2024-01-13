// NightSkyBackdrop.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StarsPattern from './StarPattern';
import AwesomeButton from 'react-native-really-awesome-button';

const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
    const onPressLetters = () => {
        props.navigation.navigate('Letters');
    };

    const onPressEvent = () => {
        props.navigation.navigate('CountDown');
    };

    const onPressMemories = () => {
        props.navigation.navigate('Memories');
    };

    const seed = 'ssss';

    return (
        <View style={styles.backdrop}>
            <View style={styles.centeredContainer}>
                <AwesomeButton onPress={onPressLetters}
                    backgroundColor="#4D94FF"
                    backgroundDarker="#3366CC"
                >Letters</AwesomeButton>
                <AwesomeButton
                    onPress={onPressEvent}
                    backgroundColor="#FF4D4D" // Red background color
                    backgroundDarker="#CC3333" // Darker shade for background
                >
                    Event
                </AwesomeButton>
                <AwesomeButton
                    onPress={onPressMemories}
                    backgroundColor="#94FF4D" // Blue background color
                    backgroundDarker="#7AA72C" // Darker shade for background
                >
                    Memories
                </AwesomeButton>
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
        flexDirection: 'row', // Horizontal layout
        justifyContent: 'space-between', // Space evenly between items
        alignItems: 'center', // Center items vertically
        position: 'absolute',
        bottom: '10%', // Adjust as needed for iOS bottom spacing
        width: '100%',
        paddingHorizontal: 20, // Add horizontal padding for spacing
        zIndex: 10,
    },
});

export default NightSkyBackdrop;

// NightSkyBackdrop.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button, Alert } from 'react-native';
import StarsPattern from './StarPattern';
import AwesomeButton from "react-native-really-awesome-button";


const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
    const onPress = () => {
        props.navigation.navigate('Letters');
    };

    const seed = 'ssss';

    return (
        <View style={styles.backdrop}>
            <View style={styles.centeredContainer}>
                <AwesomeButton onPress={onPress}>Letters</AwesomeButton>
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
});

export default NightSkyBackdrop;

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import StarPattern from './StarPattern';

const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
    const [showButtons, setShowButtons] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        animateButtons();
    }, [showButtons]);

    const animateButtons = () => {
        Animated.timing(fadeAnim, {
            toValue: showButtons ? 1 : 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    };

    const onPressLetters = () => {
        props.navigation.navigate('Letters');
        toggleButtons();
    };

    const onPressEvent = () => {
        props.navigation.navigate('CountDown');
        toggleButtons();
    };

    const onPressMemories = () => {
        props.navigation.navigate('Affirmations');
        toggleButtons();
    };

    const onPressTests = () => {
        props.navigation.navigate('Tests');
        toggleButtons();
    };

    const onPressZen = () => {
        // Handle Zen button press
        toggleButtons();
    };

    return (
        <TouchableWithoutFeedback onPress={toggleButtons}>
            <View style={styles.backdrop}>
                <StarPattern seed="jsjs"/>
                <Animated.View style={[styles.centeredContainer, { opacity: fadeAnim }]}>
                    {showButtons && (
                        <>
                            <AwesomeButton onPress={onPressLetters} backgroundColor="#3498db" backgroundDarker="#2980b9">Letters</AwesomeButton>
                            <AwesomeButton onPress={onPressEvent} backgroundColor="#e74c3c" backgroundDarker="#c0392b">Event</AwesomeButton>
                            <AwesomeButton onPress={onPressMemories} backgroundColor="#9b59b6" backgroundDarker="#8e44ad">Words</AwesomeButton>
                            <AwesomeButton onPress={onPressTests} backgroundColor="#e67e22" backgroundDarker="#d35400">Memory</AwesomeButton>

                        </>
                    )}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
    },
    centeredContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },
});

export default NightSkyBackdrop;

// NightSkyBackdrop.tsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import StarsPattern from './StarPattern';

const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void; }; }) => {
    const onPressLetters = () => {
        props.navigation.navigate('Letters');
    };

    const onPressEvent = () => {
        props.navigation.navigate('CountDown');
    };

    const onPressMemories = () => {
        props.navigation.navigate('Affirmations');
    };

    const seed = 'abdkjndjknwsskkscb';

    // Animation setup
    const fadeInOut = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeInOut, {
                    toValue: 1,
                    duration: 2000, // Adjust duration as needed
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000, // Adjust duration as needed
                    useNativeDriver: true,
                    easing: Easing.elastic(2),
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 1000, // Adjust duration as needed
                    useNativeDriver: true,
                    easing: Easing.elastic(2),
                }),
                Animated.timing(fadeInOut, {
                    toValue: 0,
                    duration: 2000, // Adjust duration as needed
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
            ]),
            { iterations: -1 }
        ).start();
    }, [fadeInOut, scaleAnim]);

    return (
        <View style={styles.backdrop}>
            <View style={styles.centeredContainer}>
                <Animated.View
                    style={{
                        ...styles.heartContainer,
                        opacity: fadeInOut,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Text style={styles.text}>Soul</Text>
                </Animated.View>
                <Animated.View
                    style={{
                        ...styles.heartContainer,
                        opacity: fadeInOut,
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Text style={styles.textSync}>Sync</Text>
                </Animated.View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    text: {
        fontSize: 24,
        color: '#8a2be2', // Adjust the color to a cute and romantic color
        fontWeight: 'bold',
    },
    textSync: {
        fontSize: 24,
        color: '#ff69b4', // Adjust the color to a cute and romantic color
        fontWeight: 'bold',
    },
    heartContainer: {
        marginRight: 10,
    },
});

export default NightSkyBackdrop;

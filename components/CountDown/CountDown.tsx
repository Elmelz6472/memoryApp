import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import AwesomeButton from 'react-native-really-awesome-button'
import { useNavigation } from '@react-navigation/native'

const CountDown: React.FC = () => {
    const navigation = useNavigation()
    const countdownDate = new Date('2024-03-09T00:00:00Z').getTime()
    const [timeLeft, setTimeLeft] = useState(countdownDate - new Date().getTime())

    const animatedValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime()
            const timeDifference = countdownDate - currentTime
            setTimeLeft(timeDifference)

            if (timeDifference <= 0) {
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [countdownDate])

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]),
        ).start()
    }

    useEffect(() => {
        startAnimation()
    }, [])

    const colorInterpolate = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['#3498db', '#e74c3c', '#3498db'],
    })

    const scaleInterpolate = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    })

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.text,
                    { color: colorInterpolate, transform: [{ scale: scaleInterpolate }] },
                ]}
            >
                Next event in
            </Animated.Text>
            <View style={styles.countdownContainer}>
                <View style={styles.countdownItem}>
                    <Text style={styles.countdownValue}>{days}</Text>
                    <Text style={styles.countdownLabel}>Days</Text>
                </View>
                <View style={styles.countdownItem}>
                    <Text style={styles.countdownValue}>{hours}</Text>
                    <Text style={styles.countdownLabel}>Hours</Text>
                </View>
                <View style={styles.countdownItem}>
                    <Text style={styles.countdownValue}>{minutes}</Text>
                    <Text style={styles.countdownLabel}>Minutes</Text>
                </View>
                <View style={styles.countdownItem}>
                    <Text style={styles.countdownValue}>{seconds}</Text>
                    <Text style={styles.countdownLabel}>Seconds</Text>
                </View>
            </View>
            <View style={styles.memoriesButtonContainer}>
                <AwesomeButton
                    onPress={() => {
                        navigation.goBack()
                    }}
                    backgroundColor='#FF4D4D'
                    backgroundDarker='#CC3333'
                >
                    Go Back
                </AwesomeButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    countdownContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    countdownValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    countdownLabel: {
        fontSize: 12,
        color: '#666',
    },
    memoriesButtonContainer: {
        position: 'absolute',
        bottom: '5%',
    },
})

export default CountDown

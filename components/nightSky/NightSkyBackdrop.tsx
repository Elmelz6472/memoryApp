import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native'
import AwesomeButton from 'react-native-really-awesome-button'
import StarPattern from './StarPattern'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useAppContext } from '../../AppContext'

const NightSkyBackdrop = (props: { navigation: { navigate: (arg0: string) => void } }) => {
    const [showButtons, setShowButtons] = useState(true)
    const fadeAnim = useRef(new Animated.Value(1)).current
    const { seedValue, mode, availableApps, selectedApps } = useAppContext()

    useEffect(() => {
        animateButtons()
    }, [showButtons])

    useEffect(() => {
        console.log('selectedApps ', JSON.stringify(selectedApps, null, 2))
    }, [selectedApps])

    const animateButtons = () => {
        Animated.timing(fadeAnim, {
            toValue: showButtons ? 1 : 0,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }

    const toggleButtons = () => {
        setShowButtons(!showButtons)
    }

    const onPressLetters = () => {
        props.navigation.navigate('Letters')
        toggleButtons()
    }

    const onPressEvent = () => {
        props.navigation.navigate('CountDown')
        toggleButtons()
    }

    const onPressMemories = () => {
        props.navigation.navigate('Affirmations')
        toggleButtons()
    }

    const onPressTests = () => {
        props.navigation.navigate('Tests')
        toggleButtons()
    }

    return (
        <TouchableWithoutFeedback onPress={toggleButtons}>
            <View style={styles.backdrop}>
                <StarPattern seed={seedValue} />
                <Animated.View style={[styles.UpperContainer, { opacity: fadeAnim }]}>
                    {showButtons && (
                        <>
                            <View style={styles.upperButtonsContainer}>
                                {mode === 'default' && (
                                    <>
                                        {selectedApps.some((app) => app.name === 'camera') && (
                                            <AwesomeButton
                                                onPress={() => {
                                                    props.navigation.navigate('CameraVideo')
                                                }}
                                                backgroundColor='#27ae60' // Green
                                                backgroundDarker='#219d54'
                                                style={styles.button}
                                            >
                                                <FontAwesome5
                                                    name='camera'
                                                    size={30}
                                                    color='#FFFFFF'
                                                />
                                            </AwesomeButton>
                                        )}

                                        {selectedApps.some((app) => app.name === 'bucketList') && (
                                            <AwesomeButton
                                                onPress={() => {
                                                    props.navigation.navigate('BucketList')
                                                }}
                                                backgroundColor='#FF1493'
                                                backgroundDarker='#C71585'
                                            >
                                                <FontAwesome5
                                                    name='list'
                                                    size={30}
                                                    color={'#FFF'}
                                                />
                                            </AwesomeButton>
                                        )}

                                        {selectedApps.some((app) => app.name === 'chat') && (
                                            <AwesomeButton
                                                onPress={() => {
                                                    props.navigation.navigate('Convo')
                                                }}
                                                backgroundColor='#DAA520'
                                                backgroundDarker='#B8860B'
                                            >
                                                <FontAwesome5
                                                    name='comments'
                                                    size={30}
                                                    color='#FFFFFF'
                                                />
                                            </AwesomeButton>
                                        )}

                                        <AwesomeButton
                                            onPress={() => {
                                                props.navigation.navigate('Settings')
                                            }}
                                            backgroundColor='#CCCCCC' // Orange
                                            backgroundDarker='#999999'
                                        >
                                            <FontAwesome5 name='cog' size={30} color='#FFFFFF' />
                                        </AwesomeButton>

                                        <AwesomeButton
                                            onPress={() => {
                                                props.navigation.navigate('RDV')
                                            }}
                                            backgroundColor='#FF69B4' // Pink
                                            backgroundDarker='#D450A4'
                                        >
                                            <FontAwesome5
                                                name='music'
                                                size={30}
                                                color='#FFFFFF'
                                            />
                                        </AwesomeButton>
                                    </>
                                )}

                                {mode === 'compact' && ( // Conditionally render cog button
                                    <AwesomeButton
                                        onPress={() => {
                                            props.navigation.navigate('Settings')
                                        }}
                                        backgroundColor='#CCCCCC' // Orange
                                        backgroundDarker='#999999'
                                    >
                                        <FontAwesome5 name='cog' size={30} color='#FFFFFF' />
                                    </AwesomeButton>
                                )}
                            </View>
                        </>
                    )}
                </Animated.View>

                <Animated.View style={[styles.centeredContainer, { opacity: fadeAnim }]}>
                    {showButtons && (
                        <>
                            <View style={styles.bottomButtonsContainer}>
                                {selectedApps.some((app) => app.name === 'letters') && (
                                    <AwesomeButton
                                        onPress={onPressLetters}
                                        backgroundColor='#3498db'
                                        backgroundDarker='#2980b9'
                                    >
                                        <FontAwesome5 name='envelope' size={30} color='#FFFFFF' />
                                    </AwesomeButton>
                                )}

                                {selectedApps.some((app) => app.name === 'countdown') && (
                                    <AwesomeButton
                                        onPress={onPressEvent}
                                        backgroundColor='#e74c3c'
                                        backgroundDarker='#c0392b'
                                    >
                                        <FontAwesome5 name='calendar' size={30} color='#FFFFFF' />
                                    </AwesomeButton>
                                )}

                                {selectedApps.some((app) => app.name === 'affirmations') && (
                                    <AwesomeButton
                                        onPress={onPressMemories}
                                        backgroundColor='#9b59b6'
                                        backgroundDarker='#8e44ad'
                                    >
                                        <FontAwesome5 name='heart' size={30} color='#FFFFFF' />
                                    </AwesomeButton>
                                )}

                                {selectedApps.some((app) => app.name === 'memories') && (
                                    <AwesomeButton
                                        onPress={onPressTests}
                                        backgroundColor='#e67e22'
                                        backgroundDarker='#d35400'
                                    >
                                        <FontAwesome5 name='star' size={30} color='#FFFFFF' />
                                    </AwesomeButton>
                                )}
                            </View>
                        </>
                    )}
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
    },
    button: {},
    UpperContainer: {
        flexDirection: 'column', // Changed to column
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: '5%',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },

    centeredContainer: {
        flexDirection: 'column', // Changed to column
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    upperButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20, // Adjust the marginBottom to create space between the upper and bottom buttons
        zIndex: 10,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
})

export default NightSkyBackdrop

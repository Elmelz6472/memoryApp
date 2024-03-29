import React, { useState, useRef } from 'react'
import { Camera, CameraType } from 'expo-camera'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Video } from 'expo-av'
import * as MediaLibrary from 'expo-media-library'
import { useNavigation } from '@react-navigation/native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import { useEffect } from 'react'

const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    return formattedTime
}

const CameraVideo = () => {
    const navigation = useNavigation()
    const [type, setType] = useState(CameraType.front)
    const [isRecording, setRecording] = useState(false)
    const [capturedVideo, setCapturedVideo] = useState<string | null>(null)
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [timer, setTimer] = useState(0)
    const [savingVideo, setSavingVideo] = useState(false) // New state for tracking saving video progress
    const [videoSaved, setVideoSaved] = useState(false)
    const cameraRef = useRef<Camera | null>(null)

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1)
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isRecording])

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setRecording(true)
                const videoRecordPromise = cameraRef.current.recordAsync({})
                const { uri } = await videoRecordPromise
                setCapturedVideo(uri)
            } catch (error) {
                console.error('Error starting video recording:', error)
            }
        }
    }

    const handleDoubleTap = () => {
        setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back))
    }

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording()
            setRecording(false)
        }
    }

    const retakeVideo = () => {
        setCapturedVideo(null)
    }

    const saveVideoToGallery = async () => {
        if (capturedVideo && !videoSaved) {
            try {
                setSavingVideo(true) // Start saving video, show loading spinner

                await MediaLibrary.saveToLibraryAsync(capturedVideo)

                // Video saved successfully
                console.log('Video saved to gallery:', capturedVideo)
                setVideoSaved(true) // Set the state to indicate the video is saved
            } catch (error) {
                console.error('Error saving video to gallery:', error)
            } finally {
                setSavingVideo(false) // Stop saving video, hide loading spinner
            }
        }
    }

    const toggleFlashMode = () => {
        setFlashMode((current: any) =>
            current === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off,
        )
    }

    return (
        <View style={styles.container}>
            {capturedVideo ? (
                <>
                    <Video
                        source={{ uri: capturedVideo }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode='cover'
                        shouldPlay
                        isLooping
                        style={
                            type === CameraType.front
                                ? styles.capturedVideoFront
                                : styles.capturedVideoBack
                        }
                    />

                    {/* Overlayed buttons container */}
                    <View style={styles.overlayButtonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={retakeVideo}>
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={saveVideoToGallery}
                            disabled={videoSaved}
                        >
                            {savingVideo ? (
                                <ActivityIndicator size='small' color='#ffffff' />
                            ) : (
                                <Text
                                    style={[
                                        styles.buttonText,
                                        { color: videoSaved ? '#999999' : 'white' },
                                    ]}
                                >
                                    {videoSaved ? 'Saved!' : 'Save to Gallery'}
                                </Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                navigation.navigate('homeScreen' as never)
                            }}
                        >
                            <Text style={styles.buttonText}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.cameraContainer}>
                    <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
                        <Camera style={styles.camera} type={type} ref={cameraRef}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.goBackButton}
                                    onPress={() => navigation.navigate('homeScreen' as never)}
                                >
                                    <Text style={styles.goBackButtonText}>Go Back</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.flashButton}
                                    onPress={toggleFlashMode}
                                >
                                    <Text style={styles.flashButtonText}>
                                        {flashMode === Camera.Constants.FlashMode.on
                                            ? 'Flash On'
                                            : 'Flash Off'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.switchButton}
                                    onPress={() => {
                                        navigation.navigate('CameraPhoto' as never)
                                    }}
                                >
                                    <Text style={styles.switchButtonText}>Go to Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={
                                        isRecording ? styles.stopRecordButton : styles.recordButton
                                    }
                                    onPress={isRecording ? stopRecording : startRecording}
                                >
                                    <View style={styles.captureInnerButton} />
                                </TouchableOpacity>
                                {isRecording && (
                                    <View style={styles.timerContainer}>
                                        <Text style={styles.timerText}>{formatTimer(timer)}</Text>
                                    </View>
                                )}
                            </View>
                        </Camera>
                    </TapGestureHandler>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'ecf0f1',
    },
    overlayButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)', // Adjust the opacity as needed
    },
    timerContainer: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 10,
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    goBackButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    goBackButtonText: {
        color: 'black',
        fontSize: 16,
    },
    switchButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    switchButtonText: {
        color: 'black',
        fontSize: 16,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    flashButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 20,
        right: 20,
    },
    flashButtonText: {
        color: 'white',
        fontSize: 16,
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    recordButton: {
        position: 'absolute',
        bottom: '1%',
        backgroundColor: '#e74c3c',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#c0392b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        right: '10%',
    },
    stopRecordButton: {
        position: 'absolute',
        bottom: '1%',
        backgroundColor: '#e74c3c',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#c0392b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        right: '10%',
    },
    captureInnerButton: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    capturedVideoFront: {
        flex: 1,
        width: '100%',
        height: '100%',
        transform: [{ scaleX: -1 }],
    },
    capturedVideoBack: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
    },
})

export default CameraVideo

import React, { useState, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { TapGestureHandler } from 'react-native-gesture-handler';

const CameraVideo = () => {
    const navigation = useNavigation();
    const [type, setType] = useState(CameraType.front);
    const [isRecording, setRecording] = useState(false);
    const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef<Camera | null>(null);

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setRecording(true);
                const videoRecordPromise = cameraRef.current.recordAsync({});
                const { uri } = await videoRecordPromise;
                setCapturedVideo(uri);
            } catch (error) {
                console.error('Error starting video recording:', error);
            }
        }
    };

    const handleDoubleTap = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };


    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setRecording(false);
        }
    };

    const retakeVideo = () => {
        setCapturedVideo(null);
    };

    const saveVideoToGallery = async () => {
        if (capturedVideo) {
            // Handle saving the video to the gallery (you can use expo-media-library or other methods)
            // For simplicity, let's just log the video URI here
            console.log('Video saved to gallery:', capturedVideo);
        }
    };

    const toggleFlashMode = () => {
        setFlashMode((current: any) => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off));
    };


    return (
        <View style={styles.container}>
            {capturedVideo ? (
                <>
                    <Video
                        source={{ uri: capturedVideo }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={styles.capturedVideo}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={retakeVideo}>
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={saveVideoToGallery}>
                            <Text style={styles.buttonText}>Save to Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            navigation.navigate("homeScreen" as never);
                        }}>
                            <Text style={styles.buttonText}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.cameraContainer}>
                    <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
                    <Camera style={styles.camera} type={type} ref={cameraRef}>
                        <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
                                    <Text style={styles.flashButtonText}>{flashMode === Camera.Constants.FlashMode.on ? 'Flash On' : 'Flash Off'}</Text>
                                </TouchableOpacity>
                                    <TouchableOpacity style={styles.switchButton} onPress={() => { navigation.navigate("CameraPhoto" as never)}}>
                                        <Text style={styles.switchButtonText}>Go to Photo</Text>
                                    </TouchableOpacity>
                            <TouchableOpacity
                                style={isRecording ? styles.stopRecordButton : styles.recordButton}
                                onPress={isRecording ? stopRecording : startRecording}
                            >
                                    <View style={styles.captureInnerButton} />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                        </TapGestureHandler>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
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
        position: "absolute",
        bottom: "1%",
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
        right: "10%"
    },
    stopRecordButton: {
        position: "absolute",
        bottom: "1%",
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
        right: "10%"
    },
    captureInnerButton: {
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
    capturedVideo: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
    },
});

export default CameraVideo;

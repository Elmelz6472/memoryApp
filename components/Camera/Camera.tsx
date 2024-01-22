import React, { useState, useRef } from 'react';
import { Camera, CameraType, CameraCapturedPicture } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, Animated } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { PinchGestureHandler, TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';



const CameraComponent = () => {
    const navigation = useNavigation();

    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isRecording, setRecording] = useState(false);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef<Camera | null>(null);
    const longPressRef = useRef<LongPressGestureHandler>(null);


    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({});
                setCapturedImage(photo.uri);
            } catch (error) {
                console.error('Error taking picture:', error);
            }
        }
    };

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setRecording(true);
                const videoRecordPromise = cameraRef.current.recordAsync({});
                const { uri } = await videoRecordPromise;
                setCapturedImage(uri);
            } catch (error) {
                console.error('Error starting video recording:', error);
            }
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setRecording(false);
        }
    };

    const handleDoubleTap = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    const toggleFlashMode = () => {
        setFlashMode((current: any) => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off));
    };

    const retakePicture = () => {
        setCapturedImage(null);
    };

    const saveToGallery = async () => {
        if (capturedImage) {
            try {
                let manipulatedImage = capturedImage;
                if (type === CameraType.front) {
                    // Flip the image horizontally using expo-image-manipulator
                    const result = await manipulateAsync(
                        capturedImage,
                        [{ flip: FlipType.Horizontal }]
                    );
                    manipulatedImage = result.uri;
                }

                await MediaLibrary.saveToLibraryAsync(manipulatedImage);
                Alert.alert('Success', 'Image/Video saved to gallery!');
            } catch (error) {
                console.error('Error saving image/video to gallery:', error);
            }
        }
    };

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    return (
        <View style={styles.container}>
            {capturedImage ? (
                <>
                    {isRecording && (
                        <TouchableOpacity style={styles.stopRecordButton} onPress={stopRecording}>
                            <Text style={styles.stopRecordButtonText}>Stop Recording</Text>
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{ uri: capturedImage }}
                        style={type === CameraType.front ? styles.capturedImageFront : styles.capturedImage}
                    />
                    <View style={styles.buttonsContainer}>
                        {!isRecording && (
                            <>
                                <TouchableOpacity style={styles.button} onPress={retakePicture}>
                                    <Text style={styles.buttonText}>Retake</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={saveToGallery}>
                                    <Text style={styles.buttonText}>Save to Gallery</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={styles.button} onPress={() => {
                            navigation.goBack();
                        }}>
                            <Text style={styles.buttonText}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <PinchGestureHandler>
                    <LongPressGestureHandler
                        ref={longPressRef}
                        onHandlerStateChange={({ nativeEvent }) => {
                            if (nativeEvent.state === State.ACTIVE) {
                                startRecording();
                            } else if (nativeEvent.state === State.END) {
                                stopRecording();
                            }
                        }}
                    >
                        <TapGestureHandler onActivated={handleDoubleTap} numberOfTaps={2}>
                            <Animated.View style={{ flex: 1 }}>
                                <Camera style={styles.camera} type={type} ref={cameraRef} flashMode={flashMode}>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.flashButton} onPress={toggleFlashMode}>
                                            <Text style={styles.flashButtonText}>{flashMode === Camera.Constants.FlashMode.on ? 'Flash On' : 'Flash Off'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                            <View style={styles.captureInnerButton} />
                                        </TouchableOpacity>
                                    </View>
                                </Camera>
                            </Animated.View>
                        </TapGestureHandler>
                    </LongPressGestureHandler>
                </PinchGestureHandler>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    capturedImage: {
        flex: 1,
        resizeMode: 'cover',
    },

    capturedImageFront: {
        flex: 1,
        resizeMode: 'cover',
       transform: [
        {scaleX: -1}
       ]
    },
    stopRecordButton: {
        backgroundColor: 'red', // Change the background color as needed
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },

    stopRecordButtonText: {
        color: 'white', // Change the text color as needed
        fontSize: 16,
        fontWeight: 'bold',
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
    permissionText: {
        textAlign: 'center',
        fontSize: 18,
        margin: 20,
    },
    permissionButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignSelf: 'center',
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 20,
    },
    flipButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
    flipButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    captureButton: {
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
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CameraComponent;

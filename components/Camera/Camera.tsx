import React, { useState, useRef } from 'react';
import { Camera, CameraType, CameraCapturedPicture } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';



const CameraComponent = () => {
    const navigation = useNavigation();

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const cameraRef = useRef<Camera | null>(null);

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

    const retakePicture = () => {
        setCapturedImage(null);
    };

    const saveToGallery = async () => {
        if (capturedImage) {
            try {
                await MediaLibrary.saveToLibraryAsync(capturedImage);
                Alert.alert('Success', 'Image saved to gallery!');
            } catch (error) {
                console.error('Error saving image to gallery:', error);
            }
        }
    };

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <View style={styles.container}>
            {capturedImage ? (
                <>
                    <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={retakePicture}>
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={saveToGallery}>
                            <Text style={styles.buttonText}>Save to Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            navigation.goBack()
                        }}>
                            <Text style={styles.buttonText}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                    <Camera style={styles.camera} type={type} ref={cameraRef}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                                <Text style={styles.flipButtonText}>↻ Flip Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                <View style={styles.captureInnerButton} />
                            </TouchableOpacity>
                        </View>
                    </Camera>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
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
        backgroundColor: '#e74c3c',
        padding: 25,
        borderRadius: 50,
        alignSelf: 'flex-end',
        borderWidth: 3,
        borderColor: '#c0392b',
        shadowColor: '#c0392b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    captureInnerButton: {
        backgroundColor: 'white',
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#e74c3c',
        alignSelf: 'center',
    },

    capturedImage: {
        flex: 1,
        resizeMode: 'cover',
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

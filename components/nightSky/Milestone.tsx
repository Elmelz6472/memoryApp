import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';

interface MilestonePopupProps {
    visible: boolean;
    onClose: () => void;
    uri?: string; // Optional picture or video URI
}

const MilestonePopup: React.FC<MilestonePopupProps> = ({
    visible,
    onClose,
    uri,
}) => {
    const [loading, setLoading] = useState(true); // State to track loading

    // Function to handle loading completion
    const handleLoad = () => {
        setLoading(false); // Set loading state to false when media is loaded
    };

    return (
        <Modal transparent visible={visible} animationType='slide'>
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Cherished Moment 💖</Text>
                    {uri && (
                        <View style={styles.mediaContainer}>
                            {(uri.includes('.mp4') || uri.includes('.mov')) ? (
                                <Video
                                    source={{ uri: uri }}
                                    style={{ width: '100%', height: '100%' }}
                                    useNativeControls
                                    isLooping
                                    shouldPlay={false}
                                    onLoad={handleLoad} // Call handleLoad when video is loaded
                                    onLoadStart={() => {
                                        setLoading(true)
                                        console.log("URI: " + uri)
                                    }} // Set loading state to true when video starts loading
                                />
                            ) : (
                                <Image
                                    source={{ uri: uri }}
                                    style={styles.media}
                                    resizeMode='cover'
                                    onLoad={handleLoad} // Call handleLoad when image is loaded
                                    onLoadStart={() => {
                                        setLoading(true)
                                        console.log("URI: " + uri)
                                    }} // Set loading state to true when image starts loading
                                />
                            )}
                            {loading && (
                                <ActivityIndicator
                                    size='large'
                                    color='#FF69B4'
                                    style={styles.loadingIndicator}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 218, 229, 0.9)', // Soft pink background
    },
    popupContainer: {
        backgroundColor: '#FFF5F8', // Creamy pink background
        borderRadius: 20,
        width: '90%', // Increase the width to take more space
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF69B4', // Hot pink text color
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FF69B4', // Hot pink title color
    },
    mediaContainer: {
        width: '100%',
        aspectRatio: 16 / 9, // Adjust as needed for your media aspect ratio
        borderRadius: 15,
        overflow: 'hidden',
        marginVertical: 20, // Increase margin to give more space
        position: 'relative', // Ensure the loading indicator is positioned correctly
    },
    media: {
        flex: 1,
    },
    loadingIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%', // Center the loading indicator vertically
    },
});

export default MilestonePopup;

import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import ImageZoomViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';


const VlogContentScreen = ({ route, navigation }: any) => { // Notice the addition of navigation here
    const { item } = route.params;
    const isVideo = item.ContentType.startsWith('video');
    const [modalVisible, setModalVisible] = useState(true);

    const images = [{ url: item.uri }];

    const renderHeader = () => (
        <TouchableOpacity
            style={{
                position: 'absolute',
                top: 40, right: 30, // Adjust positioning according to your app design
                zIndex: 1000, // Ensure the button is above all other components
            }}
            onPress={() => {
                setModalVisible(false); // Close the modal
                navigation.goBack(); // Navigate back to the previous screen
            }}>
            <Ionicons name="close-circle" size={30} color="white" />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isVideo ? (
                <Video
                    source={{ uri: item.uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    shouldPlay
                    useNativeControls
                    style={{ width: '100%', height: '100%' }}
                />
            ) : (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => {
                        setModalVisible(false); // Ensure modal can be closed using Android's back button
                        navigation.goBack();
                    }}>
                    <ImageZoomViewer
                        imageUrls={images}
                        renderHeader={renderHeader}
                    />
                </Modal>
            )}
        </View>
    );
};
// Define styles for portrait and landscape orientations
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    mediaPortrait: {
        width: '100%',
        height: '75%',
    },
    mediaLandscape: {
        width: '100%',
        height: '100%',
    },
});

export default VlogContentScreen;
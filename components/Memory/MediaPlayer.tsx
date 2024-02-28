import React, { useState } from 'react'
import { View, Image, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Video } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation'
import ImageZoomViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from '@expo/vector-icons'

const VlogContentScreen = ({ route, navigation }: any) => {
    const { item } = route.params
    const isVideo = item.ContentType.startsWith('video')
    const [modalVisible, setModalVisible] = useState(true)
    const [loading, setLoading] = useState(true) // Track loading state

    const images = [{ url: item.uri }]

    const renderHeader = () => (
        <TouchableOpacity
            style={{
                position: 'absolute',
                top: 40,
                right: 30,
                zIndex: 1000,
            }}
            onPress={() => {
                setModalVisible(false)
                navigation.goBack()
            }}
        >
            <Ionicons name='close-circle' size={30} color='white' />
        </TouchableOpacity>
    )

    const handleLoad = () => {
        setLoading(false) // Set loading to false when media is loaded
    }

    return (
        <View style={styles.container}>
            {isVideo ? (
                <Video
                    source={{ uri: item.uri }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    shouldPlay
                    useNativeControls
                    style={styles.mediaPortrait}
                    onLoad={handleLoad}
                />
            ) : (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => {
                        setModalVisible(false)
                        navigation.goBack()
                    }}
                >
                    <ImageZoomViewer
                        imageUrls={images}
                        renderHeader={renderHeader}
                        enableSwipeDown
                        onSwipeDown={() => {
                            setModalVisible(false)
                            navigation.goBack()
                        }}
                    />
                </Modal>
            )}

            {loading && (
                <ActivityIndicator size='large' color='#ffffff' style={styles.loadingIndicator} />
            )}
        </View>
    )
}

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
    loadingIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
    },
})

export default VlogContentScreen

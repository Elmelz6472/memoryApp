import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-av'

interface MilestonePopupProps {
    visible: boolean;
    onClose: () => void;
    date: string;
    event: string;
    cuteDescription: string;
    mediaUri?: string; // Optional picture or video URI
}

const MilestonePopup: React.FC<MilestonePopupProps> = ({
    visible,
    onClose,
    date,
    event,
    cuteDescription,
    mediaUri,
}) => {
    return (
        <Modal transparent visible={visible} animationType='slide'>
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Cherished Moment 💖</Text>
                    {mediaUri && (
                        <View style={styles.mediaContainer}>
                            {mediaUri.includes('.mp4') ? (
                                <Video
                                    source={{ uri: mediaUri }}
                                    style={styles.media}
                                    resizeMode='cover'
                                    controls
                                />
                            ) : (
                                <Image source={{ uri: mediaUri }} style={styles.media} resizeMode='cover' />
                            )}
                        </View>
                    )}
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailText, styles.dateText]}>{date}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.detailItem}>
                            <Text style={styles.detailText}>{event}</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.detailItem}>
                            <Text style={styles.detailText}>{cuteDescription}</Text>
                        </View>
                    </View>
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
        width: '80%',
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
        marginVertical: 10,
    },
    media: {
        flex: 1,
    },
    detailsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    detailItem: {
        marginBottom: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#FFB6C1', // Light pink separator color
        width: '100%',
        marginVertical: 5,
    },
    detailText: {
        fontSize: 18,
        color: '#7C6A70', // Soft rose text color
        textAlign: 'center',
    },
    dateText: {
        fontWeight: 'bold',
    },
});

export default MilestonePopup;

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface MilestonePopupProps {
    visible: boolean;
    onClose: () => void;
    date: string;
    event: string;
    cuteDescription: string;
}

const MilestonePopup: React.FC<MilestonePopupProps> = ({ visible, onClose, date, event, cuteDescription }) => {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Sweet Moment</Text>
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
        backgroundColor: 'rgba(255, 228, 230, 0.8)', // Light pink background
    },
    popupContainer: {
        backgroundColor: 'white',
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FF69B4', // Hot pink title color
    },
    detailsContainer: {
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    detailItem: {
        marginBottom: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#CCC', // Light gray separator color
        width: '100%',
        marginVertical: 5,
    },
    detailText: {
        fontSize: 16,
        color: '#666', // Medium gray text color
    },
    dateText: {
        fontWeight: 'bold',
    },
});

export default MilestonePopup;

import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


const PopupScreen = ({ visible, onClose }: any) => {
    const scaleValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [visible]);


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <Animated.View style={[styles.modalView, { transform: [{ scale: scaleValue }] }]}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Success</Text>
                        <Text style={styles.modalText}>Thank you for taking the time to fill out this form!</Text>
                        <FontAwesome5 name="heart" size={30} color="#FF1493" style={styles.heartIcon} />
                        <TouchableOpacity onPress={onClose} style={styles.actionButton}>
                            <Text style={styles.textStyle}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContent: {
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FF1493', // Deep Pink color for the title
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333', // Dark text
    },
    heartIcon: {
        marginVertical: 20,
    },
    actionButton: {
        backgroundColor: '#FF1493', // Deep Pink button
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default PopupScreen;

import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    DimensionValue,
} from 'react-native';
import AwesomeButton from 'react-native-really-awesome-button';
import app from '../../firebase-config'
import PopupScreen from './Popup';
import { getDatabase, ref, onValue, push, update, remove, serverTimestamp } from 'firebase/database'





const { width } = Dimensions.get('window');
const FORM_WIDTH = width * 0.8; // Adjust the width as desired

const AppointmentForm = () => {
    const navigation = useNavigation();
    const [popupVisible, setPopupVisible] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');


    const database = getDatabase(app)


    const inputFields = [
        { key: 'name', placeholder: 'Your Name', value: name, onChangeText: setName },
        { key: 'email', placeholder: 'Your Email', value: email, onChangeText: setEmail },
        { key: 'date', placeholder: 'Date (MM/DD/YYYY)', value: date, onChangeText: setDate },
        { key: 'time', placeholder: 'Time', value: time, onChangeText: setTime },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleSubmit = () => {
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Date:', date);
        console.log('Time:', time);

        const rdvRef = ref(database, 'RDV');

        push(rdvRef, {
            name: name,
            email: email,
            date: date,
            time: time,
            timestamp: serverTimestamp() // Add server timestamp
        }).then(() => {
            console.log('Data added to Firebase Realtime Database successfully.');
        }).catch((error) => {
            console.error('Error adding data to Firebase Realtime Database:', error);
        }).finally(() => {
            setPopupVisible(true)
        });
    };



    // Heart animation
    const animatedValue = new Animated.Value(0);
    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const heartScale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.3],
    });

    const handleNext = () => {
        if (activeIndex < inputFields.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    // Calculate progress percentage
    const progress = ((activeIndex + 1) / inputFields.length) * 100;

    // Dynamically adjust width of progress bar
    const progressBarWidth = `${progress}%`;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartScale }] }]}>
                <Text style={styles.heart}>❤️</Text>
            </Animated.View>
            <View style={styles.formContainer}>
                <View style={styles.progressBarContainer}>

                    <View style={[styles.progressBar, {
                        width: progressBarWidth as DimensionValue | undefined
                    }]} />
                </View>
                <Animated.View
                    style={[
                        styles.content,
                        { transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] },
                        { width: FORM_WIDTH },
                    ]}
                >
                    <Text style={styles.title}>Book a day 4 you</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={inputFields[activeIndex].placeholder}
                        placeholderTextColor="#774360" // Placeholder text color
                        value={inputFields[activeIndex].value}
                        onChangeText={inputFields[activeIndex].onChangeText}
                    />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={handlePrev} disabled={activeIndex === 0}>
                            <Text style={[styles.button, styles.prevButton]}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} disabled={activeIndex === inputFields.length - 1}>
                            <Text style={[styles.button, styles.nextButton]}>Next</Text>
                        </TouchableOpacity>
                    </View>
                    {activeIndex === inputFields.length - 1 && (
                        <TouchableOpacity onPress={handleSubmit}>
                            <Animated.Text
                                style={[styles.button, styles.submitButton, { transform: [{ scale: heartScale }] }]}
                            >
                                Book Appointment
                            </Animated.Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
            <View style={styles.BackButtonContainer}>
                <AwesomeButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                    backgroundColor="#FF4D4D"
                    backgroundDarker="#CC3333"
                >
                    Go Back
                </AwesomeButton>
                <PopupScreen visible={popupVisible} onClose={() => {
                    setPopupVisible(false)
                    navigation.goBack();
                }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fbeadf', // Cream background
    },
    heartContainer: {
        position: 'absolute',
        top: 100,
        zIndex: 1,
    },
    heart: {
        fontSize: 30,
    },
    progressBarContainer: {
        width: FORM_WIDTH,
        height: 10,
        backgroundColor: '#ddd', // Light gray background for the progress bar container
        borderRadius: 5,
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ff1493', // Deep Pink color for the progress bar
        borderRadius: 5,
    },
    formContainer: {
        width: FORM_WIDTH,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff0f5', // Lavender Blush background
        paddingVertical: 50,
        borderRadius: 25,
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#ad4b73', // Dark pink text
    },
    input: {
        height: 45,
        width: '100%',
        borderColor: '#dd99a7', // Light pink border
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#333', // Dark text
        fontSize: 16,
        backgroundColor: 'rgba(255, 240, 245, 0.6)', // Slightly transparent lavender blush
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // White text
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3, // Shadow for Android
        shadowColor: '#ad4b73',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    prevButton: {
        backgroundColor: '#ff1493', // Deep Pink button
        paddingHorizontal: 30,
    },
    nextButton: {
        backgroundColor: '#5b92e5', // Light Blue button
        paddingHorizontal: 25,
    },
    submitButton: {
        backgroundColor: '#ff1493', // Deep Pink button
        paddingHorizontal: 30,
    },
    BackButtonContainer: {
        position: 'absolute',
        bottom: '5%',
    },
});

export default AppointmentForm;

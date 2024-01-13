// LetterSections.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AwesomeButton from 'react-native-really-awesome-button';
import { useNavigation } from '@react-navigation/native';

const BookIcon = ({ date, content }: { date: string; content: string }) => {
    const navigation = useNavigation();

    const handleBookPress = () => {
        // @ts-ignore
        navigation.navigate('LetterContent', { content });
    };

    return (
        <TouchableOpacity onPress={handleBookPress}>
            <View style={styles.bookIcon}>
                <FontAwesome5 name="book" size={30} color="#FFFFFF" />
                <Text style={styles.bookDate}>{date}</Text>
            </View>
        </TouchableOpacity>
    );
};

const LetterSections: React.FC = () => {
    const navigation = useNavigation();
    const books = [
        { date: '2022-01-01', content: 'Content for Letter A' },
        { date: '2022-02-15', content: 'Content for Letter B' },
        { date: '2022-02-15', content: 'Content for Letter C' },
        { date: '2022-02-15', content: 'Content for Letter D' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.bookshelf}>
                {books.map((book, index) => (
                    <BookIcon key={index} date={book.date} content={book.content} />
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <AwesomeButton
                    onPress={() => { navigation.goBack() }}
                    backgroundColor="#4D94FF" // Blue background color
                    backgroundDarker="#3366CC" // Darker shade for background
                >
                    Go back
                </AwesomeButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Align items with space between
        padding: 20,
        backgroundColor: '#2C3E50', // Dark background color
    },
    bookshelf: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: 500, // Adjust the height as needed
        paddingTop: 60
    },
    bookIcon: {
        width: 80,
        height: 120,
        backgroundColor: '#34495E', // Darker book color
        margin: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2C3E50', // Dark gray border color
    },
    bookDate: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#FFFFFF', // Light text color
    },
    buttonContainer: {
        alignSelf: 'center', // Center the button horizontally
        marginBottom: 20, // Add margin at the bottom
    },
});

export default LetterSections;

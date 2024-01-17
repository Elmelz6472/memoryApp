// LetterSections.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AwesomeButton from 'react-native-really-awesome-button';
import { useNavigation } from '@react-navigation/native';
import letter_1 from '../letter/letter_1'
import letter_2 from '../letter/letter_2'
import letter_3 from '../letter/letter_3'
import letter_4 from '../letter/letter_4';



const BookIcon = ({ date, content, note }: { date: string; content: string; note: string }) => {
    const navigation = useNavigation();

    const handleBookPress = () => {
        // @ts-ignore
        navigation.navigate('LetterContent', { content, note, date });
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

    const books = [letter_1, letter_2, letter_3, letter_4]

    return (
        <View style={styles.container}>
            <View style={styles.bookshelf}>
                {books.map((book, index) => (
                    <BookIcon key={index} date={book.date} content={book.content} note={book.note} />
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
        width: 100,
        height: 150,
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

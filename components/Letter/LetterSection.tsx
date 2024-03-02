// LetterSections.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AwesomeButton from 'react-native-really-awesome-button';
import { useNavigation } from '@react-navigation/native';
import letter_1 from '../../letter/letter_1'
import letter_2 from '../../letter/letter_2'
import letter_3 from '../../letter/letter_3'
import letter_4 from '../../letter/letter_4';
import letter_5 from '../../letter/letter_5';
import letter_6 from '../../letter/letter_6';
import letter_10 from '../../letter/letter_10';
import letter_11 from '../../letter/letter_11';
import letter_12 from '../../letter/letter_12';
import letter_13 from '../../letter/letter_13';
import letter_14 from '../../letter/letter_14';
import letter_special from '../../letter/letter_special';


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

    const books = [letter_3, letter_4, letter_1, letter_2, letter_5, letter_6, letter_10, letter_11, letter_12, letter_13, letter_14, letter_special];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.bookshelf}>
                    {books.map((book, index) => (
                        <BookIcon key={index} date={book.date} content={book.content} note={book.note} />
                    ))}
                </View>
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
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
        backgroundColor: '#2C3E50', // Dark background color
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 20, // Adjust the padding as needed
    },
    bookshelf: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: 60,
    },
    bookIcon: {
        fontSize: 20,
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
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#FFFFFF', // Light text color
    },
    fixedButtonContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: '5%',
    },
});

export default LetterSections;

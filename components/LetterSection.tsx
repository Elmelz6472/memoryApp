// LetterSections.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BookIcon = ({ date }: { date: string }) => (
    <View style={styles.bookIcon}>
        <FontAwesome5 name="book" size={30} color="#FFFFFF" />
        <Text style={styles.bookDate}>{date}</Text>
    </View>
);

const LetterSections: React.FC = () => {
    const books = [
        { date: '2022-01-01' },
        { date: '2022-02-15' },
        { date: '2022-02-15' },
        { date: '2022-02-15' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.bookshelf}>
                {books.map((book, index) => (
                    <BookIcon key={index} date={book.date} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#2C3E50', // Dark background color
        flex: 1,
    },
    bookshelf: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        height: 500, // Adjust the height as needed
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
});

export default LetterSections;

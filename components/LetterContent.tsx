// LetterContent.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

const LetterContent = ({ route }: any) => {
    const { content, note, date } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.letterContainer}>
                    <Text style={styles.letter}>{content}</Text>
                    <View style={styles.letterFooter}>
                        <Text style={styles.note}>{note}</Text>
                        <Text style={styles.closure}>{date}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FDF5E6',
        flex: 1,
        padding: 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    letterContainer: {
        paddingTop: 10,
        margin: 30,
        opacity: 0.9,
        width: '90%', // Reduced container width
        padding: 20,
        backgroundColor: 'rgba(255, 218, 185, 0.9)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 10,
        flex: 1,
    },
    lines: {
        position: 'absolute',
        // top: 25,
        left: 20,
        right: 20,
        bottom: 0,
        zIndex: 0,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#4E342E',
        marginBottom: 15,
    },
    letter: {
        fontSize: 14, // Smaller font size
        color: '#4E342E',
        letterSpacing: 1,
        lineHeight: 20, // Adjusted line height
        zIndex: 1,
        textDecorationLine: 'underline',
    },
    letterFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 'auto',
    },
    note: {
        textAlign: 'left',
    },
    closure: {
        textAlign: 'right',
    },
});

export default LetterContent;

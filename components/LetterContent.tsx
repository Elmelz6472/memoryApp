// LetterContent.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFonts } from 'expo-font';

const LetterContent = ({ route }: any) => {
    const { content } = route.params;

    let [fontsLoaded] = useFonts({
        'cursive': require('../assets/fonts/CedarvilleCursive-Regular.ttf'),
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.letterContainer}>
                <Text style={styles.letter}>{content}</Text>

                <View style={styles.letterFooter}>
                    <Text style={styles.note}>Note: Your additional note here</Text>
                    <Text style={styles.closure}>Sincerely, John Doe</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end', // Align content to the bottom of the screen
        alignItems: 'center',
        backgroundColor: '#FDF5E6', // Aged paper background color
        flex: 1,
        padding: 20
    },
    letterContainer: {
        paddingTop: 10,
        margin: 30,
        opacity: 0.9,
        width: '95%',
        height: '100%',
        padding: 20,
        backgroundColor: 'rgba(255, 218, 185, 0.9)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 20,
        flex: 1,
    },
    lines: {
        position: 'absolute',
        top: 25,
        left: 20,
        right: 20,
        bottom: 0,
        zIndex: 0,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#4E342E', // Dark brown color for lines
        marginBottom: 15, // Increase the distance between lines
    },
    letter: {
        fontSize: 18,
        color: '#4E342E', // Dark brown color for text
        letterSpacing: 1,
        lineHeight: 24,
        zIndex: 1,
        textDecorationLine: 'underline',
    },
    letterFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Align to the bottom
        marginTop: 'auto', // Push it to the bottom
    },
    note: {
        textAlign: 'left',
    },
    closure: {
        textAlign: 'right',
    },
});

export default LetterContent;

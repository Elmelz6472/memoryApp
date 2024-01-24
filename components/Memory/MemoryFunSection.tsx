import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AwesomeButton from 'react-native-really-awesome-button'
import { useNavigation } from '@react-navigation/native'
import videosFun from '../../videos/videosFun'

const MemoryIconVlog = ({ title, date }: any) => {
    return (
        <View>
            <View style={styles.memoryIcon}>
                <FontAwesome5 name='smile' size={30} color='#FFF' />
                <View style={styles.titleDateContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
        </View>
    )
}

const MemorySectionFun: React.FC = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.memoryShelf}>
                    {videosFun.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            // @ts-ignore
                            onPress={() => navigation.navigate('VlogContent', item)}
                            style={styles.memoryIconContainer}
                        >
                            <MemoryIconVlog {...item} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.fixedButtonContainer}>
                <AwesomeButton
                    onPress={() => {
                        navigation.goBack()
                    }}
                    backgroundColor='#c0392b'
                    backgroundDarker='#c0392b'
                >
                    Go back
                </AwesomeButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e74c3c',
    },
    memoryIconContainer: {
        alignItems: 'center', // Align items in the center
    },
    titleDateContainer: {
        marginTop: 5, // Add space between MemoryIconDate and title/date
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // Change the color to your preference
    },
    date: {
        fontSize: 14,
        color: '#fff', // Change the color to your preference
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 0, // Adjust the padding as needed
        paddingBottom: 0, // Increase the paddingBottom value
    },
    memoryShelf: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingTop: 60,
    },
    memoryIcon: {
        width: 100,
        height: 150,
        backgroundColor: '#c0392b', // Darker red memory color
        margin: 8,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#922b21', // Darker red border color
        overflow: 'hidden', // Hide any overflowing content
    },
    fixedButtonContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: '3%',
        paddingTop: 60, // Increase the paddingTop value
    },
})

export default MemorySectionFun

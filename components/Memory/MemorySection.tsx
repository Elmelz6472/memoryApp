// MemorySections.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AwesomeButton from 'react-native-really-awesome-button'
import { useNavigation } from '@react-navigation/native'

const MemoryIcon = ({ title, type }: { title: string; type: string }) => {
    const getIconName = () => {
        switch (type) {
            case 'dates':
                return 'heart'
            case 'vlogs':
                return 'video'
            case 'fun':
                return 'smile'
            case 'photoshoot':
                return 'camera'
            case 'sms':
                return 'sms'
            case 'dice':
                return 'dice'
            default:
                return 'heart'
        }
    }
    return (
        <View>
            <View style={styles.memoryIcon}>
                <FontAwesome5 name={getIconName()} size={30} color='#FFFFFF' />
                <Text style={styles.memoryDate}>{title}</Text>
            </View>
        </View>
    )
}

const onPressFun = () => { }

const MemorySections: React.FC = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.memoryShelf}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('DateSection' as never)
                        }}
                    >
                        <MemoryIcon title='Dates' type='dates' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('VlogSection' as never)
                        }}
                    >
                        <MemoryIcon title='Vlogs' type='vlogs' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('FunSection' as never)
                        }}
                    >
                        <MemoryIcon title='Random' type='dice' />
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Sms' as never)
                        }}
                    >
                        <MemoryIcon title='sms' type='sms' />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('PhotoShoot' as never)
                        }}
                    >
                        <MemoryIcon title='photoshoot' type='photoshoot' />
                    </TouchableOpacity>


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
        backgroundColor: '#e74c3c', // Red background color
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 20, // Adjust the padding as needed
    },
    memoryShelf: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center items horizontally
        alignItems: 'center', // Center items vertically
        paddingTop: 300,
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
    memoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#FFFFFF', // Light text color
    },
    fixedButtonContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: '5%', // Adjust the position as needed
    },
    memoryDate: {
        color: 'white',
    },
})

export default MemorySections

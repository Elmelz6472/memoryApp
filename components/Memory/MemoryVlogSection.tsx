import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AwesomeButton from 'react-native-really-awesome-button'
import { useNavigation } from '@react-navigation/native'
import videos from '../../videos/vlogs.json'
import { Video } from 'expo-av'
import { useAppContext } from '../../AppContext'

function shuffleArray(array: any) {
    let currentIndex = array.length,
        randomIndex

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

// Interface definitions
interface MediaFile {
    filename: string
    dimensions: number[] | null
    created: string
    ContentType: string
    uri: string
}

interface MediaCardProps {
    item: MediaFile
}

function formatDate(dateString: string | number | Date) {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    let dateComponents

    if (typeof dateString === 'string') {
        // Split the dateString into its components and convert them to numbers
        dateComponents = dateString.split(':').map((component) => parseInt(component, 10))
    } else if (typeof dateString === 'number') {
        // If dateString is a number, assume it represents a timestamp in milliseconds
        const date = new Date(dateString)
        dateComponents = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    } else if (dateString instanceof Date) {
        // If dateString is a Date object, get its components directly
        dateComponents = [dateString.getFullYear(), dateString.getMonth() + 1, dateString.getDate()]
    } else {
        // If dateString is not in a valid format, return an empty string
        return ''
    }

    const year = dateComponents[0]
    const monthIndex = dateComponents[1] - 1 // Month index is zero-based
    const day = dateComponents[2]

    // Function to add suffix to date
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th' // covers 4th to 20th
        switch (day % 10) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            default:
                return 'th'
        }
    }

    return `${monthNames[monthIndex]} ${day}${getOrdinalSuffix(day)} ${year}`
}

const MediaCard: React.FC<MediaCardProps> = ({ item }) => {
    const isVideo = item.ContentType.startsWith('video')
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            style={styles.memoryIcon}
            onPress={() => navigation.navigate('FunContent', { item })}
        >
            {isVideo ? (
                <Video
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                    useNativeControls // This shows the native playback controls
                    isLooping // If you want the video to loop
                    shouldPlay={false} // If you want the video to start playing by default
                />
            ) : (
                <Image
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='cover'
                />
            )}
            <View style={styles.titleDateContainer}>
                <Text style={styles.title}>{item.ContentType.split('/')[0].toUpperCase()}</Text>
                <Text style={styles.date}>{formatDate(item.created)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const MemoryPhotoShoot = () => {
    const navigation = useNavigation()
    const { numberOfElementDisplayed } = useAppContext()
    const shuffledAndSlicedVideos = shuffleArray([...videos]).slice(0, numberOfElementDisplayed)
    return (
        <View style={styles.container}>
            <FlatList
                data={shuffledAndSlicedVideos}
                renderItem={({ item }) => (
                    <MediaCard
                        item={item}
                        onPress={() => navigation.navigate('VlogContent', { item })}
                    />
                )}
                keyExtractor={(item) => item.filename}
                contentContainerStyle={styles.memoryShelf}
            />
        </View>
    )
}

export default MemoryPhotoShoot

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e74c3c',
    },
    memoryIconContainer: {
        alignItems: 'center', // Align items in the center
    },
    titleDateContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent dark background for better contrast
        position: 'absolute', // Adjust positioning if needed
        bottom: 0, // Align at the bottom of the memory card
        width: '100%', // Ensure it spans the full width of the card
        paddingVertical: 5, // Add some vertical padding
        paddingHorizontal: 10, // Add some horizontal padding
        alignItems: 'center', // Center-align the text
        borderBottomLeftRadius: 10, // Match the card's border radius for bottom corners
        borderBottomRightRadius: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff', // White color for better readability
        marginBottom: 2, // Add a slight space between the title and the date
    },
    date: {
        fontSize: 12,
        color: '#fff', // White color for better readability
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

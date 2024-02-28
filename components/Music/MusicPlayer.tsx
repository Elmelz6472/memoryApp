import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { BlurView } from 'expo-blur'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Audio, InterruptionModeIOS } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'
import audioFiles, { AudioFile } from '../../assets/sound/AudioFileType'

interface Playlist {
    id: number
    name: string
    songs: AudioFile[]
}

const MusicPlayer: React.FC = () => {
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(false) // State to manage loading indicator
    const [sound, setSound] = useState<Audio.Sound | null>(null) // State to manage the audio sound
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [currentSong, setCurrentSong] = useState<AudioFile | null>(audioFiles[currentSongIndex])
    const [isPlaying, setIsPlaying] = useState(false)
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [currentPosition, setCurrentPosition] = useState(0)
    const [totalDuration, setTotalDuration] = useState<number | undefined>(0)

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedPlaylists = await AsyncStorage.getItem('playlists')
            if (storedPlaylists) {
                setPlaylists(JSON.parse(storedPlaylists))
            }
        }
        fetchPlaylists()
    }, [])

    useEffect(() => {
        const initializeSong = async () => {
            setIsLoading(true) // Set loading state to true when initializing the song
            if (sound) {
                await sound.stopAsync()
                await sound.unloadAsync()
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: currentSong!!.uri },
                {},
                (status) => {
                    if (status.isLoaded) {
                        setIsLoading(false) // Set loading state to false when the sound is loaded
                        if (status.isPlaying) {
                            setCurrentPosition(status.positionMillis)
                            setTotalDuration(status.durationMillis)
                        }
                        if (status.didJustFinish) {
                            nextSong()
                        }
                    }
                },
            )
            setSound(newSound)
            if (isPlaying) {
                await newSound.playAsync()
            }
            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                shouldDuckAndroid: false,
                playThroughEarpieceAndroid: true,
                allowsRecordingIOS: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
            })
        }

        if (currentSong) {
            initializeSong()
        }

        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [currentSong])

    useEffect(() => {
        return () => {
            if (sound) {
                sound.stopAsync()
                sound.unloadAsync()
            }
        }
    }, [])

    const togglePlayback = async () => {
        if (!sound) return

        if (isPlaying) {
            await sound.pauseAsync()
        } else {
            await sound.playAsync()
        }
        setIsPlaying(!isPlaying)
    }

    const nextSong = () => {
        if (activePlaylist) {
            const nextSongIndex = (currentSongIndex + 1) % activePlaylist.songs.length
            setCurrentSongIndex(nextSongIndex)
            setCurrentSong(activePlaylist.songs[nextSongIndex])
        } else {
            const nextSongIndex = (currentSongIndex + 1) % audioFiles.length
            setCurrentSongIndex(nextSongIndex)
            setCurrentSong(audioFiles[nextSongIndex])
        }
    }

    const prevSong = () => {
        if (activePlaylist) {
            const nextSongIndex = (currentSongIndex - 1) % activePlaylist.songs.length
            setCurrentSongIndex(nextSongIndex)
            setCurrentSong(activePlaylist.songs[nextSongIndex])
        } else {
            const prevSongIndex = (currentSongIndex - 1 + audioFiles.length) % audioFiles.length
            setCurrentSongIndex(prevSongIndex)
            setCurrentSong(audioFiles[prevSongIndex])
        }
    }

    const formatDuration = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000)
        const seconds = ((milliseconds % 60000) / 1000).toFixed(0)
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`
    }

    const seekToPosition = (value: number) => {
        if (sound) {
            sound.setPositionAsync(value)
        }
    }

    const shuffleSongs = () => {
        if (activePlaylist) {
            const shuffledSongs = [...activePlaylist.songs].sort(() => Math.random() - 0.5)
            setPlaylists((prevPlaylists) => {
                const updatedPlaylists = prevPlaylists.map((playlist) => {
                    if (playlist.id === activePlaylist.id) {
                        return { ...playlist, songs: shuffledSongs }
                    }
                    return playlist
                })
                return updatedPlaylists
            })
            setCurrentSongIndex(0)
            setCurrentSong(shuffledSongs[0])
            setActivePlaylist((prevActivePlaylist) => {
                if (prevActivePlaylist) {
                    return {
                        ...prevActivePlaylist,
                        songs: shuffledSongs,
                    }
                }
                return null // Return null if prevActivePlaylist is null
            })
        }
    }

    return (
        <ImageBackground
            source={{ uri: currentSong?.coverArt }}
            style={styles.backgroundImage}
            blurRadius={5}
        >
            <BlurView intensity={50} style={styles.container}>
                {isLoading && ( // Show loading indicator if isLoading is true
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color='#3498db' />
                    </View>
                )}
                <View style={styles.navbar}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => navigation.navigate('PlaylistPage' as never)}
                    >
                        <Text style={styles.navButtonText}>Playlists</Text>
                    </TouchableOpacity>
                    <FlatList
                        horizontal
                        data={playlists}
                        keyExtractor={(playlist) => playlist.id.toString()}
                        renderItem={({ item: playlist }) => (
                            <TouchableOpacity
                                style={[
                                    styles.playlistButton,
                                    activePlaylist &&
                                        activePlaylist.id === playlist.id &&
                                        styles.activePlaylistButton,
                                ]}
                                onPress={() => {
                                    setActivePlaylist(playlist)
                                    if (activePlaylist) {
                                        setCurrentSongIndex(0)
                                        setCurrentSong(activePlaylist.songs[currentSongIndex])
                                    }
                                }}
                            >
                                <Text style={styles.playlistButtonText}>{playlist.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.songListContainer}>
                    <FlatList
                        data={activePlaylist?.songs}
                        keyExtractor={(song) => song.id.toString()}
                        extraData={activePlaylist?.songs}
                        renderItem={({ item: song }) => (
                            <TouchableOpacity
                                style={styles.songContainer}
                                onPress={() => setCurrentSong(song)}
                            >
                                <Image source={{ uri: song.coverArt }} style={styles.songArt} />
                                <View style={styles.songDetails}>
                                    <Text style={styles.songTitle}>{song.title}</Text>
                                    <Text style={styles.songArtist}>{song.artist}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.songInfoContainer}>
                    <Text style={styles.title}>{currentSong?.title}</Text>
                    <Text style={styles.artist}>{currentSong?.album}</Text>
                    <Text style={styles.artist}>{currentSong?.artist}</Text>
                    <Image source={{ uri: currentSong?.coverArt }} style={styles.image} />
                </View>
                <View style={styles.progressContainer}>
                    <Text style={styles.durationText}>{formatDuration(currentPosition)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={totalDuration}
                        value={currentPosition}
                        minimumTrackTintColor='#3498db'
                        maximumTrackTintColor='rgba(52, 152, 219, 0.3)'
                        thumbTintColor='#3498db'
                        onSlidingComplete={(value) => seekToPosition(value)}
                    />
                    <Text style={styles.durationText}>{formatDuration(totalDuration || 1)}</Text>
                </View>
                <View style={[styles.buttonsContainer, { paddingBottom: '20%' }]}>
                    <TouchableOpacity style={styles.button} onPress={prevSong}>
                        <FontAwesome name='step-backward' size={24} color='#3498db' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={togglePlayback}>
                        {isPlaying ? (
                            <FontAwesome name='pause' size={24} color='#3498db' />
                        ) : (
                            <FontAwesome name='play' size={24} color='#3498db' />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={shuffleSongs}>
                        <FontAwesome name='random' size={24} color='#3498db' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={nextSong}>
                        <FontAwesome name='step-forward' size={24} color='#3498db' />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    songListContainer: {
        maxHeight: 200,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    slider: {
        flex: 1,
        marginHorizontal: 10,
    },
    durationText: {
        color: '#ffffff',
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
    },
    songArt: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    songDetails: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    songArtist: {
        fontSize: 14,
        color: '#888',
    },
    playlistButton: {
        marginRight: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    activePlaylistButton: {
        backgroundColor: 'grey',
    },
    playlistButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    navButton: {
        padding: 10,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        opacity: 0.75,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
    },
    songInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    artist: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default MusicPlayer

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Button,
    ScrollView,
    Image,
    TextInput,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import { Audio } from 'expo-av'
import audioFiles, { AudioFile } from '../../assets/sound/AudioFileType'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { StudieesAudioObjects } from '../../assets/sound/Studiess/Studiees_AudioObject'

interface Playlist {
    id: number
    name: string
    songs: AudioFile[]
}
const playlistsStudiess = {
    id: 99,
    name: 'Studiess📕',
    songs: StudieesAudioObjects,
}

const playlistsVibees = {
    id: 99,
    name: 'Studiess📕',
    songs: StudieesAudioObjects,
}

const Player: React.FC = () => {
    const navigation = useNavigation()

    const [minimizedPlaylists, setMinimizedPlaylists] = useState<number[]>([])
    const [search, setSearch] = useState('')
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [currentSong, setCurrentSong] = useState<AudioFile | null>(audioFiles[currentSongIndex])
    const [isPlaying, setIsPlaying] = useState(false)
    const [sound, setSound] = useState<Audio.Sound | null>(null)
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedPlaylists = await AsyncStorage.getItem('playlists')
            if (storedPlaylists) {
                setPlaylists(JSON.parse(storedPlaylists))
            }
        }
        fetchPlaylists()
    }, [])

    const storePlaylists = useCallback(async (updatedPlaylists: Playlist[]) => {
        await AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists))
        setPlaylists(updatedPlaylists)
    }, [])

    const createPlaylist = useCallback(
        async (name: string) => {
            const newPlaylist = { id: Date.now(), name: name, songs: [] }
            const newPlaylists = [...playlists, newPlaylist]
            await storePlaylists(newPlaylists)
        },
        [playlists, storePlaylists],
    )

    const initializeSong = useCallback(async () => {
        if (!currentSong || !sound) return
        await sound.unloadAsync()
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: currentSong.uri })
        setSound(newSound)
        if (isPlaying) {
            await newSound.playAsync()
        }
    }, [currentSong, isPlaying, sound])

    useEffect(() => {
        initializeSong()
        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [initializeSong, sound])

    const addToPlaylist = useCallback(
        async (playlistId: number, song: AudioFile) => {
            // Check if the song already exists in the playlist
            const playlist = playlists.find((playlist) => playlist.id === playlistId)
            if (!playlist || playlist.songs.some((existingSong) => existingSong.id === song.id)) {
                return
            }
            const updatedPlaylists = playlists.map((playlist) =>
                playlist.id === playlistId
                    ? { ...playlist, songs: [...playlist.songs, song] }
                    : playlist,
            )
            await storePlaylists(updatedPlaylists)
        },
        [playlists, storePlaylists],
    )

    const removeFromPlaylist = useCallback(
        async (playlistId: number, songId: number) => {
            const updatedPlaylists = playlists.map((playlist) =>
                playlist.id === playlistId
                    ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
                    : playlist,
            )
            await storePlaylists(updatedPlaylists)
        },
        [playlists, storePlaylists],
    )

    const deletePlaylist = useCallback(
        async (playlistId: number) => {
            const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId)
            await storePlaylists(updatedPlaylists)
        },
        [playlists, storePlaylists],
    )

    const filteredAudioFiles = audioFiles.filter(
        (audioFile) =>
            audioFile.title.toLowerCase().includes(search.toLowerCase()) ||
            audioFile.artist.toLowerCase().includes(search.toLowerCase()),
    )

    const availableSongs = useMemo(
        () =>
            audioFiles.filter(
                (audioFile) =>
                    !activePlaylist ||
                    !activePlaylist.songs.some((song) => song.id === audioFile.id),
            ),
        [activePlaylist],
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.goToMusicPlayerButton}
                    onPress={() => {
                        navigation.navigate('Music player' as never)
                    }}
                >
                    <Text style={styles.goToMusicPlayerButtonText}>Music player</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder='New playlist name'
                    placeholderTextColor='#666'
                    onSubmitEditing={(event) => createPlaylist(event.nativeEvent.text)}
                />
                <FlatList
                    data={playlists}
                    keyExtractor={(playlist) => playlist.id.toString()}
                    renderItem={({ item: playlist, index: playlistIndex }) => (
                        <View style={styles.playlist}>
                            <TouchableOpacity
                                onPress={() => {
                                    setMinimizedPlaylists((prevMinimizedPlaylists) => {
                                        if (prevMinimizedPlaylists.includes(playlist.id)) {
                                            return prevMinimizedPlaylists.filter(
                                                (id) => id !== playlist.id,
                                            )
                                        } else {
                                            return [...prevMinimizedPlaylists, playlist.id]
                                        }
                                    })
                                }}
                            >
                                <Text style={styles.playlistTitle}>{playlist.name}</Text>
                            </TouchableOpacity>
                            {!minimizedPlaylists.includes(playlist.id) && (
                                <>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder='Search for songs...'
                                        placeholderTextColor='#888'
                                        value={search}
                                        onChangeText={(text) => setSearch(text)}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => deletePlaylist(playlist.id)}
                                    >
                                        <Text style={styles.removeButtonText}>Delete Playlist</Text>
                                    </TouchableOpacity>
                                    {playlist.songs.map((song, songIndex) => (
                                        <View style={styles.songContainer} key={song.id}>
                                            <Image
                                                source={{ uri: song.coverArt }}
                                                style={styles.songArt}
                                            />
                                            <Text style={styles.songTitle}>{song.title}</Text>
                                            {/* Add the index to the far right */}
                                            <Text style={styles.songIndex}>
                                                {playlistIndex + 1}.{songIndex + 1}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() =>
                                                    removeFromPlaylist(playlist.id, song.id)
                                                }
                                            >
                                                <Text style={styles.removeButtonText}>Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <Text style={styles.addSongTitle}>Add song to playlist:</Text>
                                    <ScrollView>
                                        {availableSongs
                                            .filter(
                                                (audioFile) =>
                                                    !filteredAudioFiles.some(
                                                        (filteredFile) =>
                                                            filteredFile.id === audioFile.id,
                                                    ),
                                            )
                                            .map((audioFile) => (
                                                <TouchableOpacity
                                                    style={styles.songContainer}
                                                    key={audioFile.id}
                                                    onPress={() =>
                                                        addToPlaylist(playlist.id, audioFile)
                                                    }
                                                >
                                                    <Image
                                                        source={{ uri: audioFile.coverArt }}
                                                        style={styles.songArt}
                                                    />
                                                    <Text style={styles.songTitle}>
                                                        {audioFile.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                    </ScrollView>

                                    <ScrollView>
                                        {availableSongs.map((audioFile) => (
                                            <TouchableOpacity
                                                style={styles.songContainer}
                                                key={audioFile.id}
                                                onPress={() =>
                                                    addToPlaylist(playlist.id, audioFile)
                                                }
                                            >
                                                <Image
                                                    source={{ uri: audioFile.coverArt }}
                                                    style={styles.songArt}
                                                />
                                                <Text style={styles.songTitle}>
                                                    {audioFile.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </>
                            )}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    songInfoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    songIndex: {
        color: 'black',
    },
    goToMusicPlayerButton: {
        backgroundColor: '#DAA520',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    goToMusicPlayerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 18,
        color: '#666',
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 20,
        borderRadius: 10,
    },
    addSongTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    addSongContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20,
    },
    songToAddTitle: {
        fontSize: 16,
        color: 'blue',
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30,
        backgroundColor: '#f8f8f8',
    },
    input: {
        height: 50,
        borderColor: '#ededed',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 20,
        backgroundColor: '#fafafa',
    },
    searchInput: {
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 5,
        paddingLeft: 10,
    },
    playlist: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
    },
    playlistTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    songArt: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    songTitle: {
        flex: 1,
        fontSize: 17,
    },
    removeButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    removeButtonText: {
        color: '#666',
        fontWeight: 'bold',
    },
})

export default Player

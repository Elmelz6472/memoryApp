import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import audioFiles, { AudioFile } from '../../assets/sound/AudioFileType';

interface Playlist {
    id: number;
    name: string;
    songs: AudioFile[];
}

const MusicPlayer: React.FC = () => {
    const navigation = useNavigation();
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState<AudioFile | null>(audioFiles[currentSongIndex]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [duration, setDuration] = useState('0:00');

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedPlaylists = await AsyncStorage.getItem('playlists');
            if (storedPlaylists) {
                setPlaylists(JSON.parse(storedPlaylists));
            }
        };
        fetchPlaylists();
    }, []);

    useEffect(() => {
        const initializeSong = async () => {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: currentSong!!.uri }, {}, (status) => {
            });
            setSound(newSound);
            if (isPlaying) {
                await newSound.playAsync();
            }
        };

        if (currentSong) {
            initializeSong();
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [currentSong]);

    const togglePlayback = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        if (activePlaylist) {
            const nextSongIndex = (currentSongIndex + 1) % activePlaylist.songs.length;
            setCurrentSongIndex(nextSongIndex);
            setCurrentSong(activePlaylist.songs[nextSongIndex]);
        }
        else {
            const nextSongIndex = (currentSongIndex + 1) % audioFiles.length;
            setCurrentSongIndex(nextSongIndex);
            setCurrentSong(audioFiles[nextSongIndex]);
        }
    }

    const prevSong = () => {
        if (activePlaylist) {
            const nextSongIndex = (currentSongIndex - 1) % activePlaylist.songs.length;
            setCurrentSongIndex(nextSongIndex);
            setCurrentSong(activePlaylist.songs[nextSongIndex]);
        }
        else {
            const prevSongIndex = (currentSongIndex - 1 + audioFiles.length) % audioFiles.length;
            setCurrentSongIndex(prevSongIndex);
            setCurrentSong(audioFiles[prevSongIndex]);
        }

    }


    return (

        <ImageBackground source={{ uri: currentSong?.coverArt }} style={styles.backgroundImage} blurRadius={5} >
            <BlurView intensity={50} style={styles.container}>

                <View style={styles.navbar}>
                    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PlaylistPage' as never)}>
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
                                    activePlaylist && activePlaylist.id === playlist.id && styles.activePlaylistButton
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
                        renderItem={({ item: song }) => (
                            <TouchableOpacity style={styles.songContainer} onPress={() => {
                                setCurrentSong(song)
                            }}>
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


                <View style={[styles.buttonsContainer, { paddingBottom: '20%' }]}>
                    <TouchableOpacity style={{ opacity: 0.75 }} onPress={prevSong}>
                        <FontAwesome name="step-backward" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ opacity: 0.75 }} onPress={togglePlayback}>
                        {isPlaying ? (
                            <FontAwesome name="pause" size={24} color="white" />
                        ) : (
                            <FontAwesome name="play" size={24} color="white" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ opacity: 0.75 }} onPress={nextSong}>
                        <FontAwesome name="step-forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.5)', // Transparent background to see the blurred image
    },
    songListContainer: {
        maxHeight: 200, // Adjust the height as needed
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    progressBar: {
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
        backgroundColor: 'transparent', // Set background color to transparent
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    navButton: {
        padding: 10,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555', // Set text color
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
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
        color: '#fff' // Text color for better visibility on the blurred background
    },
    artist: {
        fontSize: 18,
        color: '#fff', // Text color for better visibility on the blurred background
        marginBottom: 20,
    },
    album: {
        fontSize: 16,
        color: '#fff', // Text color for better visibility on the blurred background
        fontStyle: 'italic',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 20,
    },
    button: {
        borderColor: '#4287f5',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#4287f5',
        width: '30%'
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    }
});

export default MusicPlayer;

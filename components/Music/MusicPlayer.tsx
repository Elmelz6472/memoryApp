import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Button, View, Image, Text, TouchableOpacity, ImageBackground } from "react-native";
import { BlurView } from 'expo-blur'; // Import BlurView
import audioFiles, { AudioFile } from "../../assets/sound/AudioFileType";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { FontAwesome } from "@expo/vector-icons";



interface Playlist {
    id: number;
    name: string;
    songs: AudioFile[];
}

const MusicPlayer: React.FC = () => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentSong, setCurrentSong] = useState<AudioFile | null>(audioFiles[currentSongIndex]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedPlaylists = await AsyncStorage.getItem('playlists');
            if (storedPlaylists) {
                setPlaylists(JSON.parse(storedPlaylists))
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

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: currentSong!!.uri });
            setSound(newSound);
            if (isPlaying) {
                await newSound.playAsync();
            }
        }

        if (currentSong) {
            initializeSong();
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        }
    }, [currentSong]);

    const togglePlayback = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    }

    const nextSong = () => {
        const nextSongIndex = (currentSongIndex + 1) % audioFiles.length;
        setCurrentSongIndex(nextSongIndex);
        setCurrentSong(audioFiles[nextSongIndex]);
    }

    const prevSong = () => {
        const prevSongIndex = (currentSongIndex - 1 + audioFiles.length) % audioFiles.length;
        setCurrentSongIndex(prevSongIndex);
        setCurrentSong(audioFiles[prevSongIndex]);
    }

    const selectPlaylist = (playlistId: number) => {
        setActivePlaylist(playlists.find(playlist => playlist.id === playlistId) || null);
    }

    return (

        <ImageBackground source={{ uri: currentSong?.coverArt }} style={styles.backgroundImage} blurRadius={5} >
            <BlurView intensity={50} style={styles.container}>
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

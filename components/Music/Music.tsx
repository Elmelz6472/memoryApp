import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, TextInput } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { TaylorSwiftAudioFiles } from '../../assets/sound/Taylor_Swift/Taylor_Swift_AudioObject'
import { KanyeWestAudioFiles } from '../../assets/sound/Kanye_West/Kanye_West_AudioObject'
import { AudioFile } from "../../assets/sound/AudioFileType";

const { width } = Dimensions.get('window');


const BasicAudioPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const soundObject = useRef(new Audio.Sound());

    const audioFiles: AudioFile[] = KanyeWestAudioFiles.concat(TaylorSwiftAudioFiles)

    useEffect(() => {
        return () => {
            soundObject.current.unloadAsync();
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying) {
                soundObject.current.getStatusAsync().then((status) => {
                    if (status.isLoaded) {
                        setCurrentPosition(status.positionMillis / 1000);
                    }
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.durationMillis !== undefined) {
            const { positionMillis, durationMillis } = status;
            const isFinished = positionMillis >= (durationMillis - 1000); // Within 1 second of end
            if (isFinished && !status.isLooping) {
                await onNextPress();
            }
        }
    };

    useEffect(() => {
        soundObject.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }, []);


    const loadAudio = async (index: number) => {
        setIsPlaying(false);
        await soundObject.current.unloadAsync();
        await soundObject.current.loadAsync({ uri: audioFiles[index].uri });
        setIsPlaying(true);
        await soundObject.current.playAsync();
    };

    const playPauseAudio = async () => {
        if (isPlaying) {
            await soundObject.current.pauseAsync();
            setIsPlaying(false);
        } else {
            await soundObject.current.playAsync();
            setIsPlaying(true);
        }
    };

    const onNextPress = async () => {
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= audioFiles.length) {
            nextIndex = 0; // Wrap around to the first song
        }
        setCurrentTrackIndex(nextIndex);
        await loadAudio(nextIndex);
    };

    const onPreviousPress = async () => {
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) {
            prevIndex = audioFiles.length - 1;
        }
        setCurrentTrackIndex(prevIndex);
        await loadAudio(prevIndex);
    };

    const onShufflePress = async () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * audioFiles.length);
        } while (newIndex === currentTrackIndex);
        setCurrentTrackIndex(newIndex);
        await loadAudio(newIndex);
    };

    const onSliderValueChange = async (value: number) => {
        await soundObject.current.setPositionAsync(value * 1000);
        setCurrentPosition(value);
    };

    const selectTrack = async (index: number) => {
        setCurrentTrackIndex(index);
        await loadAudio(index);
    };

    const renderItem = useCallback(({ item, index }: any) => (
        <TouchableOpacity
            style={index === currentTrackIndex ? styles.listItemActive : styles.listItem}
            onPress={() => selectTrack(index)}
        >
            <Image source={{ uri: item.coverArt }} style={styles.coverArt} />
            <View style={styles.listItemInfo}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    ), [currentTrackIndex]);

    const currentAudioFile = audioFiles[currentTrackIndex];

    // Function to filter audio files based on search query
    const filteredAudioFiles = audioFiles.filter(
        (file) =>
            file.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function durationToSeconds(durationString: string) {
        const [minutes, seconds] = durationString.split(':').map(Number);
        return minutes * 60 + seconds;
    }


    return (
        <View style={styles.container}>
            {/* Search input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search for artist, album or title"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
            />

            {/* Player section */}
            <View style={styles.playerContainer}>
                <Image source={{ uri: currentAudioFile.coverArt }} style={styles.coverArtPlayer} />
                <Text style={styles.title}>{currentAudioFile.title}</Text>
                <Text style={styles.album}>{currentAudioFile.album}</Text>
                <Text style={styles.artist}>{currentAudioFile.artist}</Text>
                <Slider
                    style={styles.progressContainer}
                    value={currentPosition}
                    minimumValue={0}
                    maximumValue={durationToSeconds(currentAudioFile.duration)}
                    thumbTintColor="#007bff"
                    minimumTrackTintColor="#007bff"
                    onSlidingComplete={onSliderValueChange}
                />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.controlButton} onPress={onPreviousPress}>
                        <FontAwesome name="backward" size={24} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.controlButton, styles.playPauseButton]} onPress={playPauseAudio}>
                        <FontAwesome name={isPlaying ? 'pause-circle' : 'play-circle'} size={48} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={onNextPress}>
                        <FontAwesome name="forward" size={24} color="#007bff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.shufflerContainer}>
                    <TouchableOpacity style={styles.shufflerButton} onPress={onShufflePress}>
                        <FontAwesome name="random" size={20} color="#007bff" />
                        <Text style={styles.shufflerText}>Shuffle</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredAudioFiles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {

    },
    container: {
        flex: 1,
        paddingVertical: 15,
    },
    playerContainer: {
        paddingTop: 0,
        alignItems: 'center',
        marginBottom: 0,
        paddingHorizontal: 20,
    },
    searchInput: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    coverArtPlayer: {
        width: width - 80,
        height: width - 80,
        marginBottom: 5,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    artist: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    album: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    progressContainer: {
        width: '100%',
        height: 30,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    controlButton: {
        margin: 0,
    },
    playPauseButton: {
        marginHorizontal: 32,
    },
    shufflerContainer: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shufflerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shufflerText: {
        color: '#007bff',
        fontSize: 16,
        paddingLeft: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    listItemActive: {
        backgroundColor: '#e0f7ff',
    },
    coverArt: {
        left: 10,
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    listItemInfo: {
        marginLeft: 10,
        flex: 1,
    },
    listItemTitle: {
        fontWeight: 'bold',
        color: '#000',
    },
    listItemArtist: {
        color: '#666',
    },
    listItemAlbum: {
        color: '#666',
    }
});

export default BasicAudioPlayer;

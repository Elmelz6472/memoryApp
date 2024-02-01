import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface AudioFile {
    id: number;
    uri: string;
    artist: string;
    title: string;
    durationSecond: number;
    coverArt: string;
}

const audioFiles: AudioFile[] = [
    {
        id: 1,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/affirmation_music.mp3?alt=media&token=27f313cb-aa3f-43d3-8216-e1e46caf4e59',
        artist: 'Artist 1',
        title: 'Affirmation Music',
        durationSecond: 399,
        coverArt: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/Screenshot%202024-02-01%20at%2012.12.53%E2%80%AFPM.png?alt=media&token=ddbab5e9-adea-4128-ba09-169265e77142',
    },
    {
        id: 2,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/lol.mp3?alt=media&token=eb022955-6e66-44b1-8aba-31d05be20e5a',
        artist: 'Artist 2',
        title: 'barcaaaa',
        durationSecond: 42,
        coverArt: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/Screenshot%202024-02-01%20at%2012.12.53%E2%80%AFPM.png?alt=media&token=ddbab5e9-adea-4128-ba09-169265e77142'

    },
];

const BasicAudioPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const soundObject = useRef(new Audio.Sound());
    const isReady = useRef(false);

    useEffect(() => {
        return soundObject.current
            ? () => {
                soundObject.current.unloadAsync();
            }
            : undefined;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPlaying && isReady.current) {
                soundObject.current.getStatusAsync().then((status) => {
                    if (status.isLoaded) {
                        setCurrentPosition(status.positionMillis / 1000);
                    }
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const loadAudio = async (index: number) => {
        const playbackInstance = soundObject.current;
        await playbackInstance.unloadAsync();
        await playbackInstance.loadAsync({ uri: audioFiles[index].uri });
        playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        isReady.current = true;
        setCurrentPosition(0);
    };

    const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
        if (status.isLoaded && status.durationMillis !== undefined) {
            const { positionMillis, durationMillis } = status;
            const isFinished = positionMillis >= (durationMillis - 1000); // Within 1 second of end
            if (isFinished && !status.isLooping) {
                await onNextPress();
            }
        }
    };

    const playPauseAudio = async () => {
        if (isPlaying) {
            await soundObject.current.pauseAsync();
        } else {
            if (!isReady.current) {
                await loadAudio(currentTrackIndex);
            }
            await soundObject.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const onNextPress = async () => {
        if (currentTrackIndex < audioFiles.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
        } else {
            setCurrentTrackIndex(0);
        }
        if (isPlaying) {
            await loadAudio(currentTrackIndex + 1);
            await soundObject.current.playAsync();
        }
    };

    const onPreviousPress = async () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
        } else {
            setCurrentTrackIndex(audioFiles.length - 1);
        }
        if (isPlaying) {
            await loadAudio(currentTrackIndex - 1);
            await soundObject.current.playAsync();
        }
    };

    const onShufflePress = async () => {
        let newIndex = Math.floor(Math.random() * audioFiles.length);
        while (newIndex === currentTrackIndex) {
            newIndex = Math.floor(Math.random() * audioFiles.length);
        }
        setCurrentTrackIndex(newIndex);
        if (isPlaying) {
            await loadAudio(newIndex);
            await soundObject.current.playAsync();
        }
    };

    const onSliderValueChange = async (value: number) => {
        if (isReady.current) {
            await soundObject.current.setPositionAsync(value * 1000);
            setCurrentPosition(value);
            if (!isPlaying) {
                setIsPlaying(true);
                await soundObject.current.playAsync();
            }
        }
    };

    const currentAudioFile = audioFiles[currentTrackIndex];

    return (
        <View style={styles.container}>
            <Image source={{ uri: currentAudioFile.coverArt }} style={styles.coverArt} />
            <Text style={styles.title}>{currentAudioFile.title}</Text>
            <Text style={styles.artist}>{currentAudioFile.artist}</Text>
            <Slider
                style={styles.progressContainer}
                value={currentPosition}
                minimumValue={0}
                maximumValue={currentAudioFile.durationSecond}
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
    );
};

const styles = StyleSheet.create({
    button: {

    },
    container: {
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        padding: 20,
        top: 100
    },
    coverArt: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
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
    progressContainer: {
        width: '100%',
        height: 40,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    controlButton: {
        margin: 16,
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
});

export default BasicAudioPlayer;

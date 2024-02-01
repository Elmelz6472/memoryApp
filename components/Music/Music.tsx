import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

interface AudioFile {
    id: number;
    uri: string;
    title: string;
    durationSecond: number;
}

const audioFiles: AudioFile[] = [
    {
        id: 1,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/affirmation_music.mp3?alt=media&token=27f313cb-aa3f-43d3-8216-e1e46caf4e59',
        title: 'Affirmation Music',
        durationSecond: 399,
    },
    {
        id: 2,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/lol.mp3?alt=media&token=eb022955-6e66-44b1-8aba-31d05be20e5a',
        title: 'barcaaaa',
        durationSecond: 42,

    },
];

const BasicAudioPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const soundObject = useRef(new Audio.Sound());
    const isReady = useRef(false);

    useEffect(() => {
        setupAudio();
        return () => {
            Audio.setAudioModeAsync({ staysActiveInBackground: true }); // Keep audio playing in the background
        };
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

    const setupAudio = async () => {
        await Audio.setAudioModeAsync({ staysActiveInBackground: true }); // Keep audio playing in the background
        return soundObject.current
            ? () => {
                soundObject.current.unloadAsync();
            }
            : undefined;
    };

    const loadAudio = async (index: number) => {
        const playbackInstance = soundObject.current;
        await playbackInstance.stopAsync(); // Stop all other tracks
        await playbackInstance.unloadAsync(); // Unload current track
        await playbackInstance.loadAsync({ uri: audioFiles[index].uri }); // Load new track
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
            <Text style={styles.title}>{currentAudioFile.title}</Text>
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
                <TouchableOpacity style={styles.button} onPress={onPreviousPress}>
                    <FontAwesome name="step-backward" size={30} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={playPauseAudio}>
                    <FontAwesome name={isPlaying ? 'pause' : 'play'} size={30} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onNextPress}>
                    <FontAwesome name="step-forward" size={30} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onShufflePress}>
                    <FontAwesome name="random" size={30} color="#007bff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 18,
        marginBottom: 10
    },
    progressContainer: {
        width: '80%',
        height: 40
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20
    },
    button: {
        marginHorizontal: 20 // Adjust this value to increase or decrease spacing between icons
    }
});

export default BasicAudioPlayer;

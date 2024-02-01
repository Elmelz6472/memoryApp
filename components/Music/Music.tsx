import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, TextInput } from 'react-native';
import { AVPlaybackStatus, Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import audioFiles from '../../assets/sound/AudioFileType';
import { useAppContext } from '../../AppContext';

const { width } = Dimensions.get('window');

const BasicAudioPlayer = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const soundObject = useRef(new Audio.Sound());
    const [shuffle, setShuffle] = useState(false);
    const [shuffledIndexList, setShuffledIndexList] = useState([]);
    const isLoadedRef = useRef(false);

    const { mode } = useAppContext()

    enum Mode {
        Compact = 'compact',
        Default = 'default',
    }



    Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
    }).catch((error) => {
        console.error('Error setting audio mode:', error);
    });;


    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setCurrentPosition(status.positionMillis);
            if (status.isPlaying !== isPlaying) {
                setIsPlaying(status.isPlaying);
            }
            if (status.didJustFinish && !status.isLooping) {
                onNextPress();
            }
        } else {
            if (status.error) {
                console.error(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    }, []);



    useEffect(() => {
        loadAudio(currentTrackIndex);

        return () => {
            if (soundObject.current) {
                soundObject.current.unloadAsync();
            }
        };
    }, [currentTrackIndex]);


    useEffect(() => {
        soundObject.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
        return () => {
            if (soundObject.current) {
                soundObject.current.unloadAsync().catch((error) => {
                    console.error('Error unloading audio:', error);
                });
            }
        };
    }, [onPlaybackStatusUpdate]);



    const loadAudio = async (index: any) => {
        const playbackObject = soundObject.current;
        if (playbackObject) {
            setIsPlaying(false);
            setCurrentPosition(0);  // Resetting the progress bar
            isLoadedRef.current = false;
            try {
                await playbackObject.unloadAsync();
                await playbackObject.loadAsync({ uri: audioFiles[index].uri });
                isLoadedRef.current = true;
                await playbackObject.playAsync();
            } catch (error) {
                console.error("Error loading and playing audio:", error);
            }
        }
    };

    const playPauseAudio = async () => {
        const playbackObject = soundObject.current;
        if (!playbackObject) return;

        try {
            if (isPlaying) {
                await playbackObject.pauseAsync();
            } else {
                await playbackObject.playAsync();
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Error playing/pausing audio', error);
        }
    };


    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };


    const toggleShuffle = () => {
        const newShuffleState = !shuffle;
        if (newShuffleState) {
            // Create an array of track indices and shuffle it
            const shuffledIndices = shuffleArray(audioFiles.map((_, index) => index));
            setShuffledIndexList(shuffledIndices);
            setCurrentTrackIndex(shuffledIndices[0]); // Start with the first track in the shuffled list
        } else {
            // If shuffle is turned off, reset to the original list and current index
            setShuffledIndexList([]);
            // Optionally, you can set currentTrackIndex to the track that was playing before shuffling
        }
        setShuffle(newShuffleState);
    };



    const onNextPress = () => {
        setCurrentTrackIndex((prevIndex) => {
            if (shuffle) {
                const currentShuffledIndex = shuffledIndexList.indexOf(prevIndex);
                const nextShuffledIndex = (currentShuffledIndex + 1) % shuffledIndexList.length;
                return shuffledIndexList[nextShuffledIndex];
            } else {
                return (prevIndex + 1) % audioFiles.length;
            }
        });
        isLoadedRef.current = false;
    };


    const onPreviousPress = () => {
        setCurrentTrackIndex((prevIndex) => {
            if (shuffle) {
                const currentShuffledIndex = shuffledIndexList.indexOf(prevIndex);
                const prevShuffledIndex = (currentShuffledIndex - 1 + shuffledIndexList.length) % shuffledIndexList.length;
                return shuffledIndexList[prevShuffledIndex];
            } else {
                return prevIndex === 0 ? audioFiles.length - 1 : prevIndex - 1;
            }
        });
        isLoadedRef.current = false;
    };

    const onSliderValueChange = async (value: any) => {
        if (isLoadedRef.current) {
            try {
                await soundObject.current.setPositionAsync(value);
                setCurrentPosition(value);
            } catch (error) {
                console.error('Error setting audio position:', error);
            }
        }
    };

    const selectTrack = async (index: any) => {
        setCurrentTrackIndex(index);
        isLoadedRef.current = false;
    };

    // Function to filter audio files based on search query
    const filteredAudioFiles = audioFiles.filter(
        (file) =>
            file.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
    ), [currentTrackIndex, selectTrack]);

    const currentAudioFile = audioFiles[currentTrackIndex];

    function durationToSeconds(durationString: string) {
        const [minutes, seconds] = durationString.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    function getFormattedTime(ms: any) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <View style={styles.container}>
            {/* Search input */}


            {mode == Mode.Default && <TextInput
                style={styles.searchInput}
                placeholder="Search for artist, album or title"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
            />}
            {/* Player section */}
            <View style={styles.playerContainer}>
                <Image source={{ uri: currentAudioFile.coverArt }} style={styles.coverArtPlayer} />
                <Text style={styles.title}>{currentAudioFile.title}</Text>
                <Text style={styles.album}>{currentAudioFile.album}</Text>
                <Text style={styles.artist}>{currentAudioFile.artist}</Text>
                <Slider
                    style={styles.progressContainer}
                    value={currentPosition}
                    onValueChange={onSliderValueChange} // This updates the slider while dragging
                    onSlidingComplete={onSliderValueChange} // This sets the position when the user lets go
                    maximumValue={isLoadedRef.current ? durationToMillis(currentAudioFile.duration) : 0}
                    minimumValue={0}
                    thumbTintColor="#007bff"
                    minimumTrackTintColor="#007bff"
                    maximumTrackTintColor="#e0e0e0"
                />

                <TouchableOpacity onPress={toggleShuffle} style={styles.shuffleButton}>
                    <FontAwesome name={shuffle ? 'random' : 'retweet'} size={24} color={shuffle ? '#007bff' : '#666'} />
                </TouchableOpacity>


                <Text style={styles.currentTime}>{getFormattedTime(currentPosition)}</Text>
                <Text style={styles.duration}>{currentAudioFile.duration}</Text>



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
            </View>



            {mode == Mode.Default &&
                (<FlatList
                    data={filteredAudioFiles}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />)}
        </View>
    );
};



function durationToMillis(durationString: string) {
    const [minutes, seconds] = durationString.split(':').map(Number);
    return (minutes * 60 + seconds) * 1000;
}


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
    },
    progressContainer: {
        width: '100%',
        height: 30,
        marginTop: 20,
    },
    currentTime: {
        position: 'absolute',
        left: 20,
        bottom: 10,
    },
    duration: {
        position: 'absolute',
        right: 20,
        bottom: 10,
    },
});

export default BasicAudioPlayer;

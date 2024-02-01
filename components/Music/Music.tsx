import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ProgressBarAndroid, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';

interface AudioFile {
    id: number;
    uri: string;
    title: string;
}

interface SoundState {
    [key: number]: { sound: Audio.Sound; isPlaying: boolean; progress: number } | undefined;
}

export default function MusicComponent(): JSX.Element {
    const [sounds, setSounds] = useState<SoundState>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        return () => {
            Object.values(sounds).forEach((soundObject) => {
                if (soundObject?.sound) {
                    soundObject.sound.unloadAsync();
                }
            });
        };
    }, []);

    const playSound = async (item: AudioFile): Promise<void> => {
        const { sound } = await Audio.Sound.createAsync({ uri: item.uri }, {}, () => { }, true);
        setSounds(prevState => ({ ...prevState, [item.id]: { sound, isPlaying: true, progress: 0 } }));
        await sound.playAsync();
        updateProgress(item.id);
    };

    const pauseSound = async (itemId: number): Promise<void> => {
        const soundObject = sounds[itemId];
        if (soundObject?.sound) {
            await soundObject.sound.pauseAsync();
            setSounds(prevState => ({
                ...prevState,
                [itemId]: {
                    ...(prevState[itemId] as { sound: Audio.Sound; isPlaying: boolean; progress: number } || {}),
                    isPlaying: false
                }
            }));
        }
    };

    const updateProgress = async (itemId: number): Promise<void> => {
        const soundObject = sounds[itemId];
        if (soundObject?.sound) {
            const status = await soundObject.sound.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
                if (status.durationMillis != 0 && status.durationMillis) {
                    const progress = status.positionMillis / status.durationMillis;
                    setSounds(prevState => ({
                        ...prevState,
                        [itemId]: {
                            ...(prevState[itemId] as { sound: Audio.Sound; isPlaying: boolean; progress: number } || {}),
                            progress
                        }
                    }));
                }

            }
            setTimeout(() => updateProgress(itemId), 1000);
        }
    };

    const filteredAudioFiles = audioFiles.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }: { item: AudioFile }): JSX.Element => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.buttonContainer}>
                <FontAwesome5
                    name={sounds[item.id]?.isPlaying ? 'pause' : 'play'}
                    size={20}
                    color="#007bff"
                    onPress={() => {
                        if (sounds[item.id]?.isPlaying) {
                            pauseSound(item.id);
                        } else {
                            playSound(item);
                        }
                    }}
                />
                <Text style={styles.statusText}>{sounds[item.id]?.isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
            {sounds[item.id]?.isPlaying && (
                <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={sounds[item.id]?.progress}
                    style={{ width: '100%', marginTop: 10 }}
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search Music"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <FlatList
                data={filteredAudioFiles}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const audioFiles: AudioFile[] = [
    {
        id: 1,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/affirmation_music.mp3?alt=media&token=27f313cb-aa3f-43d3-8216-e1e46caf4e59',
        title: 'Affirmation Music'
    },
    {
        id: 2,
        uri: 'https://firebasestorage.googleapis.com/v0/b/memoryapp-fc002.appspot.com/o/affirmation_music.mp3?alt=media&token=27f313cb-aa3f-43d3-8216-e1e46caf4e59',
        title: 'barcaaaa'
    },

];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        marginRight: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#888888',
    },
    progressBar: {
        marginTop: 10,
    },
    searchBar: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

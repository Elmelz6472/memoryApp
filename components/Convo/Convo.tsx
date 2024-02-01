import React, { useState } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { Audio } from 'expo-av';

interface AudioFile {
    id: number;
    uri: string;
    title: string;
}

export default function App(): JSX.Element {
    const [sounds, setSounds] = useState<{ [key: number]: Audio.Sound | undefined }>({});

    const playSound = async (item: AudioFile): Promise<void> => {
        const { sound } = await Audio.Sound.createAsync({ uri: item.uri });
        setSounds(prevState => ({ ...prevState, [item.id]: { sound, isPlaying: true } }));
        await sound.playAsync();
    };

    const pauseSound = async (itemId: number): Promise<void> => {
        const soundObject = sounds[itemId];
        if (soundObject?.sound) {
            await soundObject.sound.pauseAsync();
            setSounds(prevState => ({ ...prevState, [itemId]: { ...prevState[itemId], isPlaying: false } }));
        }
    };




    const renderItem = ({ item }: { item: AudioFile }): JSX.Element => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text>{item.title}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    title={sounds[item.id]?.isPlaying ? 'Pause' : 'Play'}
                    onPress={() => {
                        if (sounds[item.id]?.isPlaying) {
                            pauseSound(item.id);
                        } else {
                            playSound(item);
                        }
                    }}
                />
                <Text>{sounds[item.id]?.isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
                data={audioFiles}
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
    // Add more audio files as needed
];

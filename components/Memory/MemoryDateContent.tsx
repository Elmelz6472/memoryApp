import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const MemoryDateContent = ({ route }: any) => {
    const { uri, title, date, type } = route.params;

    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    return (
        <View style={styles.container}>
            {type === 'video' ? (
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: uri,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            ) : (
                <Image
                    source={{
                        uri: uri,
                    }}
                    style={styles.image}
                />
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.date}>{date} {type as string}</Text>
            </View>
            <View style={styles.buttons}>
                {type === 'video' && (
                    <Button
                        title={status.isPlaying ? 'Pause' : 'Play'}
                        onPress={() =>
                            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                        }
                    />
                )}
                {/* You can add additional buttons or functionality based on the type */}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
    },
    video: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        color: '#777',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MemoryDateContent;

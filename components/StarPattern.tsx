import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import seedrandom from 'seedrandom';
import MilestonePopup from './Milestone'; // Import the MilestonePopup component

interface Milestone {
    date: string;
    event: string;
    cuteDescription: string;
}

const StarsPattern: React.FC<{ seed: string }> = ({ seed }) => {
    const rng = seedrandom(seed);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [shiningStars, setShiningStars] = useState<number[]>([]);
    const milestones: Milestone[] = [
        { date: '9th march', event: 'happy ending', cuteDescription: 'Milestone 1 Cute Description' },
        { date: 'Milestone 2 Date', event: 'Milestone 2 Event', cuteDescription: 'Milestone 2 Cute Description' },
    ];

    const generateRandomSize = () => {
        return Math.floor(rng() * 3) + 1; // Random size between 1 and 3
    };

    const generateRandomPosition = () => {
        return {
            left: rng() * 100 + '%',
            top: rng() * 100 + '%',
        };
    };

    const handleStarClick = (id: number) => {
        setSelectedStar(id);
    };

    const handleClosePopup = () => {
        setSelectedStar(null);
    };

    const renderStars = () => {
        const numberOfStars = 100; // You can adjust the number of stars as needed
        const stars = [];

        for (let i = 0; i < numberOfStars; i++) {
            const size = generateRandomSize();
            const position = generateRandomPosition();
            const isShining = shiningStars.includes(i);

            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarClick(i)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={[
                        styles.star,
                        { width: size, height: size, opacity: isShining ? 1 : 0.5 },
                        position as ViewStyle,
                    ]}
                >
                    <Text style={styles.starId}>{i}</Text>
                </TouchableOpacity>
            );
        }

        return stars;
    };

    useEffect(() => {
        const shiningInterval = setInterval(() => {
            const newShiningStars: number[] = [];
            for (let i = 0; i < 5; i++) {
                const randomStar = Math.floor(rng() * 50);
                newShiningStars.push(randomStar);
            }
            setShiningStars(newShiningStars);

            setTimeout(() => {
                setShiningStars([]);
            }, 1000);
        }, 5000);

        return () => clearInterval(shiningInterval);
    }, []);

    return (
        <View style={styles.starsContainer}>
            {renderStars()}
            {selectedStar !== null && (
                <MilestonePopup
                    visible={selectedStar !== null}
                    onClose={handleClosePopup}
                    {...milestones[selectedStar]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    starsContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    star: {
        position: 'absolute',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    starId: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default StarsPattern;

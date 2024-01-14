import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Svg, Polygon, Text } from 'react-native-svg';
import seedrandom from 'seedrandom';
import MilestonePopup from './Milestone';
import milestones from '../utils/mileStones';

const StarsPattern: React.FC<{ seed: string }> = ({ seed }) => {
    const rng = seedrandom(seed);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [shiningStars, setShiningStars] = useState<number[]>([]);

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
        const numberOfStars = 150; // You can adjust the number of stars as needed
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
                    style={[styles.star, position as ViewStyle]}
                >
                    <Svg width={size * 10} height={size * 10}>
                        <Polygon
                            points="5,0 6,3 9,3 7,5 8,8 5,6 2,8 3,5 1,3 4,3"
                            fill={isShining ? 'red' : 'white'}
                        />
                        {/* <Text
                            x="50%"
                            y="50%"
                            fontSize={size * 2}
                            fontWeight="bold"
                            fill="white"
                            textAnchor="middle"
                        >
                            {i}
                        </Text> */}
                    </Svg>
                </TouchableOpacity>
            );
        }

        return stars;
    };

    useEffect(() => {
        const shiningInterval = setInterval(() => {
            const newShiningStars: number[] = [];
            for (let i = 0; i < 5; i++) {
                const randomStar = Math.floor(rng() * 100);
                newShiningStars.push(randomStar);
            }
            setShiningStars(newShiningStars);

            setTimeout(() => {
                setShiningStars([]);
            }, 500);
        }, 1000);

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
    },
});

export default StarsPattern;

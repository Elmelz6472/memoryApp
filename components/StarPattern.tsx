import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Svg, Polygon, Text } from 'react-native-svg';
import seedrandom from 'seedrandom';
import MilestonePopup from './Milestone';
import milestones from '../utils/mileStones';

const StarsPattern: React.FC<{ seed: string }> = ({ seed }) => {
    const rng = seedrandom(seed);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [shiningStars, setShiningStars] = useState<{ [key: number]: string }>({});

    const generateRandomSize = () => {
        return Math.floor(rng() * 3) + 1; // Random size between 1 and 3
    };

    const generateRandomPosition = () => {
        const minPosition = 5; // Set your minimum position value here
        const left = Math.max(minPosition, rng() * 100);
        const top = Math.max(minPosition, rng() * 100);

        return {
            left: left + '%',
            top: top + '%',
        };
    };


    const generateRandomColor = () => {
        const randomColor = `rgb(${Math.floor(rng() * 256)}, ${Math.floor(rng() * 256)}, ${Math.floor(rng() * 256)})`;
        return randomColor;
    };

    const handleStarClick = (id: number) => {
        setSelectedStar(id);
    };

    const handleClosePopup = () => {
        setSelectedStar(null);
    };

    const renderStars = () => {
        const numberOfStars = 130; // You can adjust the number of stars as needed
        const stars = [];

        for (let i = 0; i < numberOfStars; i++) {
            const size = generateRandomSize();
            const position = generateRandomPosition();
            const isShining = shiningStars.hasOwnProperty(i);

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
                            fill={isShining ? shiningStars[i] : 'white'}
                        />
                    </Svg>
                </TouchableOpacity>
            );
        }

        return stars;
    };

    useEffect(() => {
        const shiningInterval = setInterval(() => {
            const newShiningStars: { [key: number]: string } = {};
            for (let i = 0; i < 5; i++) {
                const randomStar = Math.floor(rng() * 100);
                newShiningStars[randomStar] = generateRandomColor();
            }
            setShiningStars(newShiningStars);

            setTimeout(() => {
                setShiningStars({});
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

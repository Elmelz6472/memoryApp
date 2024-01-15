// StarsPattern.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import seedrandom from 'seedrandom';
import MilestonePopup from './Milestone';
import milestones from '../utils/mileStones';

const StarsPattern: React.FC<{ seed: string }> = ({ seed }) => {
    const rng = seedrandom(seed);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [starPositions, setStarPositions] = useState<{ [key: number]: { left: string; top: string } }>({});
    const [shiningStars, setShiningStars] = useState<{ [key: number]: boolean }>({});

    const generateRandomSize = () => {
        return (rng() * 2.9) + 0.01; // Random size between 0.1 and 4.0
    };

    const generateRandomPositions = () => {
        const positions: { [key: number]: { left: string; top: string } } = {};
        const numberOfStars = 550; // You can adjust the number of stars as needed

        for (let i = 0; i < numberOfStars; i++) {
            const left = rng() * 100 + '%';
            const top = rng() * 100 + '%';

            positions[i] = { left, top };
        }

        setStarPositions(positions);
    };

    const generateRandomColor = (position: number, maxPosition: number) => {
        // Generate a gradient-like color based on the position from left to right
        const purple = { r: 138, g: 43, b: 226 }; // RGB values for purple
        const pink = { r: 255, g: 105, b: 180 }; // RGB values for pink

        const r = Math.floor((position / maxPosition) * (pink.r - purple.r)) + purple.r;
        const g = Math.floor((position / maxPosition) * (pink.g - purple.g)) + purple.g;
        const b = Math.floor((position / maxPosition) * (pink.b - purple.b)) + purple.b;

        return `rgb(${r}, ${g}, ${b})`;
    };

    const handleStarClick = (id: number) => {
        setSelectedStar(id);
    };

    const handleClosePopup = () => {
        setSelectedStar(null);
    };

    const animateTwinkle = () => {
        const newShiningStars: { [key: number]: boolean } = {};
        for (let i = 0; i < 15; i++) {
            const randomStar = Math.floor(rng() * 350);
            newShiningStars[randomStar] = true;
        }
        setShiningStars(newShiningStars);

        setTimeout(() => {
            setShiningStars({});
        }, 800);
    };

    const renderStars = () => {
        const maxLeftPosition = 100;
        const stars = [];

        for (let i = 0; i < Object.keys(starPositions).length; i++) {
            const size = generateRandomSize();
            const isShining = shiningStars.hasOwnProperty(i);

            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleStarClick(i)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={[styles.star, starPositions[i] as ViewStyle]}
                >
                    <Svg width={size * 10} height={size * 10}>
                        <Circle
                            cx="50%"
                            cy="50%"
                            r={size}
                            fill={isShining ? 'white' : generateRandomColor(parseFloat(starPositions[i].left), maxLeftPosition)}
                            opacity={isShining ? 0.7 : 1} // Adjust opacity for twinkling effect
                        />
                    </Svg>
                </TouchableOpacity>
            );
        }

        return stars;
    };

    useEffect(() => {
        generateRandomPositions();
        animateTwinkle();
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

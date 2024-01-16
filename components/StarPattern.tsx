// StarsPattern.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import seedrandom from 'seedrandom';
import MilestonePopup from './Milestone';
import milestones from '../utils/mileStones';

const StarsPattern: React.FC<{ seed: string }> = ({ seed }) => {
    let intervalDuration = 2000; // Initial interval duration

    const rng = seedrandom(seed);
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [starPositions, setStarPositions] = useState<{ [key: number]: { left: string; top: string } }>({});
    const [shiningStars, setShiningStars] = useState<{ [key: number]: boolean }>({});
    const [fadeAnimation] = useState(new Animated.Value(1)); // Initial opacity set to 1 (fully black)

    const generateRandomSize = () => {
        return (rng() * 2.9) + 0.01; // Random size between 0.1 and 4.0
    };

    const generateRandomColor = (position: number, maxPosition: number) => {
        const purple = { r: 148, g: 87, b: 235 }; // Adjusted RGB values for purple
        const pink = { r: 255, g: 182, b: 193 }; // Adjusted RGB values for pink

        const r = Math.floor((position / maxPosition) * (pink.r - purple.r)) + purple.r;
        const g = Math.floor((position / maxPosition) * (pink.g - purple.g)) + purple.g;
        const b = Math.floor((position / maxPosition) * (pink.b - purple.b)) + purple.b;

        return `rgb(${r}, ${g}, ${b})`;
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

    const calculateMorphingColor = (position: number, maxPosition: number, time: number) => {
        const t = time / 60000; // Normalize time to be between 0 and 1
        const baseColor = generateRandomColor(position, maxPosition);
        const targetColor = generateRandomColor(position, maxPosition);

        const r = Math.floor((1 - t) * parseInt(baseColor.slice(4, 7)) + t * parseInt(targetColor.slice(4, 7)));
        const g = Math.floor((1 - t) * parseInt(baseColor.slice(9, 12)) + t * parseInt(targetColor.slice(9, 12)));
        const b = Math.floor((1 - t) * parseInt(baseColor.slice(14, 17)) + t * parseInt(targetColor.slice(14, 17)));

        return `rgb(${r}, ${g}, ${b})`;
    };

    const calculateMorphingOpacity = (time: number) => {
        const t = time / 60000; // Normalize time to be between 0 and 1
        return 0.3 + 0.4 * Math.sin(2 * Math.PI * t);
    };

    const animateTwinkle = (numberOfStars: number) => {
        const newShiningStars: { [key: number]: boolean } = {};
        for (let i = 0; i < numberOfStars; i++) {
            const randomStar = Math.floor(rng() * 350);
            newShiningStars[randomStar] = true;
        }
        setShiningStars(newShiningStars);

        setTimeout(() => {
            setShiningStars({});
        }, 800); // Longer twinkle animation time (in milliseconds)
    };

    const animateMorphing = () => {
        let twinklingStarsCount = 1; // Initial number of twinkling stars

        const intervalId = setInterval(() => {
            animateTwinkle(twinklingStarsCount);
            twinklingStarsCount = Math.min(200, twinklingStarsCount + 2); // Increase the number of twinkling stars, but ensure it doesn't go above 50
            intervalDuration = Math.max(100, intervalDuration - 100); // Decrement interval duration, but ensure it doesn't go below 50
        }, intervalDuration);

        // Clear the interval after a certain time or when the component unmounts
        setTimeout(() => {
            clearInterval(intervalId);
        }, 90000); // Total morphing animation time (in milliseconds)
    };


    const handleStarClick = (id: number) => {
        setSelectedStar(id);
    };

    const handleClosePopup = () => {
        setSelectedStar(null);
    };

    const renderStars = () => {
        const maxLeftPosition = 100;
        const currentTime = new Date().getTime();
        const stars = [];

        for (let i = 0; i < Object.keys(starPositions).length; i++) {
            const size = generateRandomSize();
            const isShining = shiningStars.hasOwnProperty(i);
            const color = isShining ? 'white' : calculateMorphingColor(parseFloat(starPositions[i].left), maxLeftPosition, currentTime);
            const opacity = isShining ? 0.7 : calculateMorphingOpacity(currentTime);

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
                            fill={color}
                            opacity={opacity}
                        />
                    </Svg>
                </TouchableOpacity>
            );
        }

        return stars;
    };

    useEffect(() => {
        generateRandomPositions();

        // Start the fade out animation when the component mounts
        Animated.timing(fadeAnimation, {
            toValue: 0,
            duration: 5000, // Duration for the black overlay to fade out (adjust as needed)
            useNativeDriver: true,
        }).start();

        animateMorphing();
    }, []);

    return (
        <View style={styles.starsContainer}>
            {/* Black overlay */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: 'black', opacity: fadeAnimation },
                ]}
            />

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

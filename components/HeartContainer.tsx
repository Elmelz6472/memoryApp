// HeartContainer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeartIcon from '../heartIcon'; // Import the HeartIcon component

const HeartContainer = ({ children }: any) => {
    return (
        <View style={styles.container}>
            <HeartIcon width={50} height={50} color="#FF6B6B" />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
});

export default HeartContainer;

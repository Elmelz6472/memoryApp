// Settings.tsx
import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import { useAppContext } from '../../AppContext';
import { Picker as RNPicker } from '@react-native-picker/picker';

// Import the Theme enum
enum Theme {
    Light = 'light',
    Dark = 'dark',
    Bright = 'bright',
}

const Settings = () => {
    const {
        seedValue,
        setSeedValue,
        theme,
        setTheme,
        numberOfElementDisplayed,
        setNumberOfElementDisplayed,
    } = useAppContext();
    const [toggleValue, setToggleValue] = useState(false);

    const handleToggleChange = () => {
        setToggleValue(!toggleValue);
    };

    const handleSeedChange = (value: string) => {
        setSeedValue(value);
    };

    const handleThemeChange = (selectedTheme: Theme) => {
        setTheme(selectedTheme);
    };

    const handleNumberOfElementChange = (value: string) => {
        // Ensure the input value is a valid number
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) || value === "") {
            setNumberOfElementDisplayed(isNaN(parsedValue) ? 0 : parsedValue);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Seed Value</Text>
                <TextInput
                    style={styles.input}
                    value={seedValue}
                    onChangeText={handleSeedChange}
                    keyboardType="default"
                />
            </View>

            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Theme</Text>
                <RNPicker
                    selectedValue={theme}
                    style={styles.picker}
                    onValueChange={(itemValue: Theme) => handleThemeChange(itemValue as Theme)}
                >
                    <RNPicker.Item label="Light" value={Theme.Light} />
                    <RNPicker.Item label="Dark" value={Theme.Dark} />
                    <RNPicker.Item label="Bright" value={Theme.Bright} />
                </RNPicker>
            </View>

            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Number of Elements Displayed</Text>
                <TextInput
                    style={styles.input}
                    value={numberOfElementDisplayed.toString()}
                    onChangeText={handleNumberOfElementChange}
                    keyboardType="numeric" // Numeric keypad
                    onFocus={() => setNumberOfElementDisplayed(0)} // Clear the text when focused
                    onBlur={() => {
                        // Update the state when the input loses focus
                        // This usually happens when the keyboard is dismissed
                        setNumberOfElementDisplayed(prevValue => {
                            if (isNaN(prevValue)) {
                                return 0;
                            }
                            return prevValue;
                        });
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    optionText: {
        fontSize: 16,
        color: '#555',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        flex: 1,
        marginLeft: 10,
        padding: 8,
        color: '#333',
    },
    picker: {
        width: '50%',
        color: '#333',
    },
});

export default Settings;

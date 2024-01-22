// Settings.tsx
import React, { useState } from 'react';
import { View, Text, Switch, TextInput, StyleSheet } from 'react-native';
import { useAppContext } from '../../AppContext';
import { Picker } from '@react-native-picker/picker';


// Import the Theme enum
enum Theme {
    Light = 'light',
    Dark = 'dark',
    Bright = 'bright'
}

const Settings = () => {
    const { seedValue, setSeedValue, theme, setTheme } = useAppContext();
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
                <Picker
                    selectedValue={theme}
                    style={styles.picker}
                    onValueChange={(itemValue: Theme) => handleThemeChange(itemValue as Theme)}
                >
                    <Picker.Item label="Light" value={Theme.Light} />
                    <Picker.Item label="Dark" value={Theme.Dark} />
                    <Picker.Item label="Bright" value={Theme.Bright} />

                </Picker>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    optionText: {
        fontSize: 16,
    },
    slider: {
        width: '70%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        flex: 1,
        marginLeft: 10,
        padding: 8,
    },
    picker: {
        width: '50%',
    },
});

export default Settings;

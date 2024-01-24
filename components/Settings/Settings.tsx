import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native'
import { useAppContext } from '../../AppContext'
import { Picker as RNPicker } from '@react-native-picker/picker'
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper' // Importing components from react-native-paper
import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'
import { CheckBox } from 'react-native-elements'

interface App {
    id: number
    name: string
}
enum Theme {
    Light = 'light',
    Dark = 'dark',
    Bright = 'bright',
}

enum Mode {
    Compact = 'compact',
    Default = 'default',
}

const Settings = () => {
    const navigation = useNavigation()
    const {
        seedValue,
        setSeedValue,
        theme,
        setTheme,
        numberOfElementDisplayed,
        setNumberOfElementDisplayed,
        mode,
        setMode,
        availableApps,
        setAvailableApps,
        selectedApps,
        setSelectedApps,
    } = useAppContext()
    const [toggleValue, setToggleValue] = useState(false)

    const handleToggleChange = () => {
        setToggleValue(!toggleValue)
    }

    const handleSeedChange = (value: string) => {
        setSeedValue(value)
    }

    const handleThemeChange = (selectedTheme: Theme) => {
        setTheme(selectedTheme)
    }

    const handleNumberOfElementChange = (value: number) => {
        // Ensure the input value is a valid number
        setNumberOfElementDisplayed(value)
    }

    const handleModeChange = (selectedMode: Mode) => {
        setMode(selectedMode)
    }

    const handleSave = () => {
        // Implement logic to save settings
        // You can use the values from the state (seedValue, theme, numberOfElementDisplayed, mode)
        // and perform any save operation here
        // For demonstration, let's just log the values
        console.log('Settings saved:', {
            seedValue,
            theme,
            numberOfElementDisplayed,
            mode,
        })
        setSeedValue(seedValue)
        setTheme(theme)
        setNumberOfElementDisplayed(numberOfElementDisplayed)
        setMode(mode)
        navigation.navigate('homeScreen' as never)
    }

    const handleCancel = () => {
        console.log('Settings canceled')
        navigation.navigate('homeScreen' as never)
    }

    const handleAppToggle = (selectedApp: App) => {
        // Check if the selected app is already in the selectedApps array
        const isSelected = selectedApps.some((app) => app.id === selectedApp.id)

        // If it's selected, remove it; otherwise, add it to the selection
        setSelectedApps((prevSelectedApps) =>
            isSelected
                ? prevSelectedApps.filter((app) => app.id !== selectedApp.id)
                : [...prevSelectedApps, selectedApp],
        )
    }

    return (
        <View style={styles.container}>
            <View style={[styles.optionContainer, styles.separator]}>
                <Text style={styles.optionText}>Seed Value</Text>
                <PaperTextInput
                    style={styles.input}
                    value={seedValue}
                    onChangeText={handleSeedChange}
                    keyboardType='default'
                />
            </View>

            <View style={[styles.optionContainer, styles.separator]}>
                <Text style={styles.optionText}>Theme</Text>
                <RNPicker
                    selectedValue={theme}
                    style={styles.picker}
                    onValueChange={(itemValue: Theme) => handleThemeChange(itemValue as Theme)}
                >
                    <RNPicker.Item label='Light' value={Theme.Light} />
                    <RNPicker.Item label='Dark' value={Theme.Dark} />
                    <RNPicker.Item label='Bright' value={Theme.Bright} />
                </RNPicker>
            </View>

            <View style={[styles.optionContainer, styles.separator]}>
                <Text style={styles.optionText}>#Display elements: </Text>
                <Text style={styles.sliderValue}>{numberOfElementDisplayed}</Text>
                <Slider
                    style={styles.slider}
                    value={numberOfElementDisplayed}
                    onSlidingComplete={handleNumberOfElementChange}
                    minimumValue={5}
                    maximumValue={30}
                    tapToSeek={true}
                    step={1}
                />
            </View>

            <View style={[styles.optionContainer, styles.separator]}>
                <Text style={styles.optionText}>Mode</Text>
                <RNPicker
                    selectedValue={mode}
                    style={styles.picker}
                    onValueChange={(itemValue: Mode) => handleModeChange(itemValue as Mode)}
                >
                    <RNPicker.Item label='Compact' value={Mode.Compact} />
                    <RNPicker.Item label='Default' value={Mode.Default} />
                </RNPicker>
            </View>

            <View style={[styles.optionContainer, styles.separator]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    {availableApps.map((appName) => (
                        <CheckBox
                            key={appName.id}
                            title={appName.name}
                            checked={selectedApps.includes(appName)}
                            onPress={() => handleAppToggle(appName)}
                            containerStyle={styles.checkBoxContainer}
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.buttonsContainer}>
                <PaperButton mode='contained' style={styles.cancelButton} onPress={handleCancel}>
                    Cancel
                </PaperButton>
                <PaperButton mode='contained' style={styles.saveButton} onPress={handleSave}>
                    Save
                </PaperButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', // You can adjust the color to your preference
        paddingBottom: 8, // Adjust the spacing below the separator
        marginBottom: 16, // Adjust the total margin/bottom spacing
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sliderValue: {
        fontSize: 16,
        color: '#333',
    },
    slider: {
        flex: 1,
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
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        bottom: '5%',
    },
    cancelButton: {
        backgroundColor: '#d9534f', // Red color for cancel button
        flex: 1,
        marginRight: 10,
    },
    scrollContentContainer: {
        marginTop: 8,
        paddingLeft: 4, // Add some padding on the left
    },

    checkBoxContainer: {
        marginRight: 8, // Add spacing between CheckBox items
    },
    saveButton: {
        backgroundColor: '#5bc0de', // Blue color for save button
        flex: 1,
    },
})

export default Settings

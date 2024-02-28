import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAppContext } from '../../AppContext'
import { Picker as RNPicker } from '@react-native-picker/picker'
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { useNavigation } from '@react-navigation/native'
import { CheckBox } from 'react-native-elements'

// Define your enums
enum Theme {
    Light = 'light',
    Dark = 'dark',
    Bright = 'bright',
}

enum Mode {
    Compact = 'compact',
    Default = 'default',
}

interface App {
    id: number
    name: string
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
        numberOfStars,
        setNumberOfStars,
    } = useAppContext()

    // Function to save the settings to AsyncStorage
    const saveData = async () => {
        try {
            const settingsToSave = JSON.stringify({
                seedValue,
                theme,
                numberOfElementDisplayed,
                mode,
                selectedApps,
                numberOfStars,
            })
            await AsyncStorage.setItem('settings', settingsToSave)
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    // Function to load the settings from AsyncStorage
    const loadData = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('settings')
            if (savedSettings !== null) {
                console.log(savedSettings)
                const parsedSettings = JSON.parse(savedSettings)
                setSeedValue(parsedSettings.seedValue)
                setTheme(parsedSettings.theme)
                setNumberOfElementDisplayed(parsedSettings.numberOfElementDisplayed)
                setMode(parsedSettings.mode)
                setSelectedApps(parsedSettings.selectedApps)
                setNumberOfStars(parsedSettings.numberOfStars)
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }

    useEffect(() => {
        // Load data when component mounts
        loadData()
    }, [])

    // Function to handle saving settings and navigate back
    const handleSave = () => {
        saveData()
        navigation.navigate('homeScreen' as never)
    }

    const handleSeedChange = (value: string) => {
        setSeedValue(value)
    }

    const handleNumberStars = (value: number) => {
        setNumberOfStars(value)
    }

    const handleThemeChange = (selectedTheme: Theme) => {
        setTheme(selectedTheme)
    }

    const handleNumberOfElementChange = (value: number) => {
        setNumberOfElementDisplayed(value)
    }

    const handleModeChange = (selectedMode: Mode) => {
        setMode(selectedMode)
    }

    const handleCancel = () => {
        navigation.navigate('homeScreen' as never)
    }

    const handleAppToggle = (selectedApp: App) => {
        const isSelected = selectedApps.some((app) => app.id === selectedApp.id)
        setSelectedApps((prevSelectedApps) =>
            isSelected
                ? prevSelectedApps.filter((app) => app.id !== selectedApp.id)
                : [...prevSelectedApps, selectedApp],
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
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
                    <Text style={styles.optionText}># stars: </Text>
                    <Text style={styles.sliderValue}>{numberOfStars}</Text>
                    <Slider
                        style={styles.slider}
                        value={numberOfStars}
                        onSlidingComplete={handleNumberStars}
                        minimumValue={50}
                        maximumValue={300}
                        tapToSeek={true}
                        step={1}
                    />
                </View>

                <View style={[styles.optionContainer, styles.separator]}>
                    <Text style={styles.optionText}># Display elements: </Text>
                    <Text style={styles.sliderValue}>{numberOfElementDisplayed}</Text>
                    <Slider
                        style={styles.slider}
                        value={numberOfElementDisplayed}
                        onSlidingComplete={handleNumberOfElementChange}
                        minimumValue={5}
                        maximumValue={25}
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {availableApps.map((appName) => (
                            <CheckBox
                                key={appName.id}
                                title={appName.name}
                                checked={
                                    appName.name !== 'camera' &&
                                    selectedApps.some((app) => app.id === appName.id)
                                }
                                onPress={() =>
                                    appName.name !== 'camera' && handleAppToggle(appName)
                                }
                                containerStyle={
                                    appName.name === 'camera'
                                        ? [styles.checkBoxContainer, styles.greyedOutCheckbox]
                                        : styles.checkBoxContainer
                                }
                                textStyle={
                                    appName.name === 'camera' ? styles.greyedOutText : undefined
                                }
                                disabled={appName.name === 'camera'}
                            />
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

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
        borderBottomColor: '#ccc',
        paddingBottom: 8,
        marginBottom: 16,
    },
    greyedOutCheckbox: {
        backgroundColor: '#d3d3d3', // Grey color
    },

    greyedOutText: {
        color: '#808080', // Grey color
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
        backgroundColor: '#d9534f',
        flex: 1,
        marginRight: 10,
    },
    saveButton: {
        flex: 1,
    },
    checkBoxContainer: {
        marginRight: 8,
    },
})

export default Settings

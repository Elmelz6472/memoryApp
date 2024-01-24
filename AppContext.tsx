// AppContext.tsx
import React, { createContext, useContext, useState } from 'react'

// Define an enum for theme choices
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

interface AppContextType {
    seedValue: string
    setSeedValue: React.Dispatch<React.SetStateAction<string>>
    theme: Theme
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
    mode: Mode
    setMode: React.Dispatch<React.SetStateAction<Mode>>
    numberOfElementDisplayed: number
    setNumberOfElementDisplayed: React.Dispatch<React.SetStateAction<number>>
    availableApps: App[]
    setAvailableApps: React.Dispatch<React.SetStateAction<App[]>>
    selectedApps: App[]
    setSelectedApps: React.Dispatch<React.SetStateAction<App[]>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider')
    }
    return context
}

// @ts-ignore
export const AppProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [seedValue, setSeedValue] = useState('12345')
    const [theme, setTheme] = useState<Theme>(Theme.Light) // Default theme is 'light'
    const [numberOfElementDisplayed, setNumberOfElementDisplayed] = useState(10)
    const [mode, setMode] = useState<Mode>(Mode.Default)
    const [availableApps, setAvailableApps] = useState<App[]>([
        // { id: 1, name:"settings"},
        { id: 2, name: 'memories' },
        { id: 3, name: 'letters' },
        { id: 4, name: 'countdown' },
        { id: 5, name: 'affirmations' },
        { id: 6, name: 'camera' },
        { id: 7, name: 'bucketList' },
        { id: 8, name: 'chat' },
        { id: 9, name: 'RDV' },
    ])
    const [selectedApps, setSelectedApps] = useState<App[]>([{ id: 9, name: 'RDV' }])

    return (
        <AppContext.Provider
            value={{
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
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

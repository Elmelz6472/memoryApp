// AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define an enum for theme choices
enum Theme {
  Light = 'light',
  Dark = 'dark',
  Bright = 'bright'
}

enum Mode {
  Compact = 'compact',
  Default = 'default',
}

interface AppContextType {
  seedValue: string;
  setSeedValue: React.Dispatch<React.SetStateAction<string>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  numberOfElementDisplayed: number;
  setNumberOfElementDisplayed: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// @ts-ignore
export const AppProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [seedValue, setSeedValue] = useState('12345');
  const [theme, setTheme] = useState<Theme>(Theme.Light); // Default theme is 'light'
  const [numberOfElementDisplayed, setNumberOfElementDisplayed] = useState(25);
  const [mode, setMode] = useState<Mode>(Mode.Default)

  return (
    <AppContext.Provider value={{ seedValue, setSeedValue, theme, setTheme, numberOfElementDisplayed, setNumberOfElementDisplayed, mode, setMode }}>
      {children}
    </AppContext.Provider>
  );
};

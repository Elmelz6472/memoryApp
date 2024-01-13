import 'react-native-gesture-handler';


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

//Navigation import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NightSkyBackdrop from './components/NightSkyBackdrop';
import LetterSections from './components/LetterSection';
import LetterContent from './components/LetterContent';
import CountDown from './components/CountDown'


const App = () => {
  //const
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator>
        <Stack.Screen name="homeScreen" component={NightSkyBackdrop} options={{ title: 'SkyMap', headerShown: false }} />
        <Stack.Screen name="Letters" component={LetterSections} options={{ headerShown: false }} />
        <Stack.Screen name="LetterContent" component={LetterContent} options={{ title: 'Letter Content', headerStyle: { backgroundColor: "#FDF5E6"} }} />
        <Stack.Screen name="CountDown" component={CountDown} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
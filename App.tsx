import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//Navigation import
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NightSkyBackdrop from './components/NightSkyBackdrop';


//Screen Two
const ScreenTwo = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Screen Two</Text>
    </View>
  );
};

const App = () => {
  //const
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="homeScreen" component={NightSkyBackdrop} options={{ title: 'Welcome', headerShown: false }} />
        <Stack.Screen name="Letters" component={ScreenTwo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
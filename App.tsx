// App.js
import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import { AppProvider, useAppContext } from './AppContext'
import NightSkyBackdrop from './components/nightSky/NightSkyBackdrop'
import LetterSections from './components/Letter/LetterSection'
import LetterContent from './components/Letter/LetterContent'
import CountDown from './components/CountDown/CountDown'
import Affirmations from './components/Affirmation/Affirmations'
import MemorySection from './components/Memory/MemorySection'
import MemorySectionDate from './components/Memory/MemoryDateSection'
import MemoryDateContent from './components/Memory/MemoryDateContent'
import MemorySectionVlog from './components/Memory/MemoryVlogSection'
import MemoryVlogContent from './components/Memory/MemoryVlogContent'
import MemorySectionFun from './components/Memory/MemoryFunSection'
import MemoryFunContent from './components/Memory/MemoryFunContent'
import CameraPhoto from './components/Camera/CameraPhoto'
import CameraVideo from './components/Camera/CameraVideo'
import ConvoComponent from './components/Convo/Convo'
import BucketList from './components/BucketList/BucketList'
import Settings from './components/Settings/Settings'
import Form from './components/RDV/RDV'



const App = () => {
    const Stack = createStackNavigator()
    return (
        // @ts-ignore
        <AppProvider>
            <NavigationContainer>
                <StatusBar hidden />
                <Stack.Navigator>
                    <Stack.Screen
                        name='homeScreen'
                        component={NightSkyBackdrop}
                        options={{ title: 'SkyMap', headerShown: false }}
                    />
                    <Stack.Screen
                        name='Letters'
                        component={LetterSections}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='LetterContent'
                        component={LetterContent}
                        options={{
                            title: 'Letter Content',
                            headerStyle: { backgroundColor: '#FDF5E6' },
                        }}
                    />
                    <Stack.Screen
                        name='CountDown'
                        component={CountDown}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='Affirmations'
                        component={Affirmations}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='Tests'
                        component={MemorySection}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='DateSection'
                        component={MemorySectionDate}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='DateContent'
                        component={MemoryDateContent}
                        options={{
                            title: 'Date memories',
                            headerStyle: { backgroundColor: '#FDF5E6' },
                        }}
                    />
                    <Stack.Screen
                        name='VlogSection'
                        component={MemorySectionVlog}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='VlogContent'
                        component={MemoryVlogContent}
                        options={{
                            title: 'Vlog memories',
                            headerStyle: { backgroundColor: '#FDF5E6' },
                        }}
                    />
                    <Stack.Screen
                        name='FunSection'
                        component={MemorySectionFun}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='FunContent'
                        component={MemoryFunContent}
                        options={{
                            title: 'Fun memories',
                            headerStyle: { backgroundColor: '#FDF5E6' },
                        }}
                    />
                    <Stack.Screen
                        name='CameraPhoto'
                        component={CameraPhoto}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name='CameraVideo'
                        component={CameraVideo}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen name='BucketList' component={BucketList} />
                    <Stack.Screen name='Convo' component={ConvoComponent} options={{
                        title: 'Music',
                    }} />

                    <Stack.Screen name='RDV' component={Form} options={{ headerShown: false }} />

                    <Stack.Screen name='Settings' component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    )
}

export default App

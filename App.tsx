// App.js
import 'react-native-gesture-handler';
import React from 'react';
import NightSkyBackdrop from './components/NightSkyBackdrop';


const App = () => {

  return (
    <NightSkyBackdrop navigation={{
      navigate: function (arg0: string): void {
        throw new Error('Function not implemented.');
      }
    }}/>
  );
};

export default App;

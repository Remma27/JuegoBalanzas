/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
import {View} from 'react-native';
import WelcomeScreen from './src/components/WelcomeScreen';
import BalancingScales from './src/components/BalancingScales';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [playerName, setPlayerName] = useState('');

  const startGame = (name: string) => {
    setPlayerName(name);
    setCurrentScreen('game');
  };

  return (
    <View style={{flex: 1}}>
      {currentScreen === 'welcome' ? (
        <WelcomeScreen startGame={startGame} />
      ) : (
        <BalancingScales playerName={playerName} />
      )}
    </View>
  );
};

export default App;

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NameScreen from './src/components/NameScreen';
import MainMenu from './src/components/MainMenu';
import BalancingScales from './src/components/BalancingScales';
import OnlineGame from './src/components/OnlineGame';
import RankingScreen from './src/components/RankingScreen';

const KEY = 'playerName';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('name');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(name => {
        if (name) {
          setPlayerName(name);
          setScreen('menu');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveName = async (name: string) => {
    setPlayerName(name);
    await AsyncStorage.setItem(KEY, name);
    setScreen('menu');
  };

  const changeName = async () => {
    await AsyncStorage.removeItem(KEY);
    setScreen('name');
  };

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {screen === 'name' && <NameScreen onDone={saveName} />}
      {screen === 'menu' && (
        <MainMenu
          playerName={playerName}
          onChangeName={changeName}
          onSingle={() => setScreen('single')}
          onMultiplayer={() => setScreen('online')}
          onRanking={() => setScreen('ranking')}
        />
      )}
      {screen === 'single' && <BalancingScales playerName={playerName} />}
      {screen === 'online' && (
        <OnlineGame playerName={playerName} onExit={() => setScreen('menu')} />
      )}
      {screen === 'ranking' && <RankingScreen onBack={() => setScreen('menu')} />}
    </View>
  );
};

export default App;
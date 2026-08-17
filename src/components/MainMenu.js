/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RulesModal from './RulesModal';

const MainMenu = ({ playerName, onChangeName, onSingle, onMultiplayer, onRanking }) => {
  const [rulesVisible, setRulesVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚖️ Balanzas</Text>
      <View style={styles.playerRow}>
        <Text style={styles.player}>Jugador: {playerName}</Text>
        <TouchableOpacity onPress={onChangeName}>
          <Text style={styles.change}>cambiar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, styles.primary]} onPress={onSingle}>
        <Text style={styles.buttonText}>Un jugador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.gold]} onPress={onMultiplayer}>
        <Text style={styles.buttonText}>Multijugador</Text>
      </TouchableOpacity>

      <View style={styles.secondaryRow}>
        <TouchableOpacity style={[styles.buttonSmall, styles.secondary]} onPress={() => setRulesVisible(true)}>
          <Text style={styles.buttonSmallText}>Reglas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonSmall, styles.secondary]} onPress={onRanking}>
          <Text style={styles.buttonSmallText}>Ranking</Text>
        </TouchableOpacity>
      </View>

      <RulesModal visible={rulesVisible} onClose={() => setRulesVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  player: {
    fontSize: 16,
    color: '#444',
  },
  change: {
    color: '#1565C0',
    marginLeft: 8,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  button: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  gold: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondary: {
    backgroundColor: '#fff',
  },
  buttonSmallText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default MainMenu;
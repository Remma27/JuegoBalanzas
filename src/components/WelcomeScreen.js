import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const WelcomeScreen = ({ startGame }) => {
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    startGame(playerName);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to the Balancing Scales Game</Text>
      <Text style={styles.rules}>Game Rules:</Text>
      <Text style={styles.rulesText}>
        1- Players receive 10 minerals of different colors (2 of each color) with weights between 1 gram and 30 grams, and must place them on a scale to balance it.
        {"\n\n"}
        2- Players receive information about one mineral at the beginning of the game.
        {"\n\n"}
        3- They use two scales, one main and one secondary, to place the minerals.
        {"\n\n"}
        4- Each turn, players must place at least two minerals on the main scale within a five-minute time frame.
        {"\n\n"}
        5- Players cannot exchange or transfer minerals, nor remove them from the scale.
        {"\n\n"}
        6- When the main scale is balanced, players can pay to guess the weight of each mineral.
        {"\n\n"}
        7- If guessed correctly, they win two prizes, but if any guess is incorrect, they lose the paid piece.
        {"\n\n"}
        8- The game ends when no player can place more minerals on the scale.
        {"\n\n"}
        9- If the scale is balanced at the end and all weights are guessed correctly, 100 million wones are added to the final prize; otherwise, it ends in failure with no additional prizes.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Button
        title="Start Game"
        onPress={handleStartGame}
        disabled={playerName.trim() === ''}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  rules: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  rulesText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default WelcomeScreen;

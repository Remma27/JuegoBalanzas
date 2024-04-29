/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// Imports the necessary components from React and React Native
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import GuessColorModal from './GuessColorModal';
import { styles } from '../css/styles';
import MineralColorModal from './MineralColorModal';
import { useRef } from 'react';

const BalancingScales = ({ playerName }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajes, setMensajes] = useState('');
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [mainScale, setMainScale] = useState([[], []]);
  const [remainingMinerals, setRemainingMinerals] = useState({ red: 2, yellow: 2, green: 2, blue: 2, violet: 2 });
  const scrollViewRef = useRef();

  const addToLog = message => {
    setMensajes(prevMensajes => prevMensajes + message + '\n');
    console.log(message);
  };

  // Function to show an alert with a title, message, and buttons
  async function showAlert(title, message, buttons) {
    return new Promise(resolve => {
      Alert.alert(title, message, buttons, { cancelable: false });
      resolve();
    });
  }

  // Array with possible weights for the minerals
  const possibleWeights = Array.from({ length: 30 }, (_, i) => i + 1);

  // Function to generate the weights for the minerals
  const generateMineralWeights = () => {
    const weights = [];
    const mineralNames = [];
    const colors = ['red', 'yellow', 'green', 'blue', 'violet'];

    // Shuffle the colors array to randomize the order of the minerals
    colors.forEach(color => {
      const weight = possibleWeights[Math.floor(Math.random() * possibleWeights.length)];
      const count = remainingMinerals[color];
      for (let i = 1; i <= count; i++) {
        const name = `${color.charAt(0).toUpperCase() + color.slice(1)} ${i}`;
        weights.push(weight);
        mineralNames.push(name);
      }
    });

    return [weights, mineralNames];
  };


  // Function to play a round of the game
  const playRound = async () => {
    // Generates the weights for the minerals
    const [mineralWeights, mineralNames] = generateMineralWeights();
    // Creates a copy of the main scale and the remaining minerals
    const mainScaleCopy = [[...mainScale[0]], [...mainScale[1]]];
    // Creates a copy of the remaining minerals
    const remainingMineralsCopy = { ...remainingMinerals };

    const revealedMineralIndex = Math.floor(Math.random() * 10);
    const revealedWeight = mineralWeights[revealedMineralIndex];
    // Reveals the weight of a random mineral
    const revealedColor = mineralNames[revealedMineralIndex].split(' ')[0].toLowerCase();
    addToLog(`This is a clue: The weight of ${revealedColor} minerals is ${revealedWeight} grams.`);


    setMainScale(mainScaleCopy);
    setRemainingMinerals(remainingMineralsCopy);

    // If it is the first turn, print the balance information
    if (isFirstTurn) {
      setIsFirstTurn(false);
    }
    // If it is not the first turn, print the balance information
    printBalanceInfo(mainScaleCopy, remainingMineralsCopy);
  };

  // Function to print the balance information
  const printBalanceInfo = (mainScale, remainingMinerals) => {
    // Checks if the main scale is empty
    const isEmpty = mainScale[0].length === 0 && mainScale[1].length === 0;

    // If the main scale is not empty, print the balance information
    if (!isEmpty) {
      const leftMinerals = mainScale[0].map(mineral => mineral.split(' ')[0]);
      const rightMinerals = mainScale[1].map(mineral => mineral.split(' ')[0]);

      const balanceDifference = leftMinerals.length - rightMinerals.length;

      const visualLeft = getCountedMinerals(leftMinerals);
      const visualRight = getCountedMinerals(rightMinerals);

      addToLog('\nBalance\n');
      addToLog(`Left side: ${visualLeft}`);
      addToLog(`Right side: ${visualRight}`);

      // Checks the balance difference and prints the result
      if (balanceDifference === 0) {
        addToLog('The balance is even.');
      } else if (balanceDifference > 0) {
        addToLog('The left side is heavier.');
      } else {
        addToLog('The right side is heavier.');
      }
    }

    // Prints the remaining minerals
    if (!isEmpty) {
      addToLog('\nRemaining minerals:');
      for (const [color, quantity] of Object.entries(remainingMinerals)) {
        const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
        addToLog(`${formattedColor}: ${quantity}`);
      }
    }
  };

  // Function to count the minerals
  const getCountedMinerals = (minerals) => {
    const mineralCounts = {};
    // Counts the minerals and returns the result
    minerals.forEach(mineral => {
      mineralCounts[mineral] = (mineralCounts[mineral] || 0) + 1;
    });
    return Object.entries(mineralCounts).map(([mineral, count]) => `${count} ${mineral}`).join(', ');
  };

  // Function to place a mineral on the scale
  const placeMineral = async (color) => {
    if (remainingMinerals[color] <= 0) {
      addToLog(`No ${color} minerals available.`);
      return false;
    }
    const side = await new Promise(resolve => {
      showAlert(
        'Enter Side',
        'Choose the side where you want to place the mineral:',
        [
          { text: 'Left', onPress: () => resolve('l') },
          { text: 'Right', onPress: () => resolve('r') },
        ],
        { cancelable: false },
      );
    });
    // Checks the side and places the mineral
    if (side !== 'l' && side !== 'r') {
      addToLog("Invalid side. Enter 'l' for left or 'r' for right.");
      return false; // No se pudo colocar el mineral
    }
    // Places the mineral on the scale
    setRemainingMinerals(prevRemainingMinerals => {
      const remainingMineralsCopy = { ...prevRemainingMinerals };

      const placedMineralIndex = Object.entries(remainingMineralsCopy).findIndex(([mineralColor, quantity]) => {
        return mineralColor.startsWith(color.toLowerCase()) && quantity > 0;
      });

      // Checks if the mineral was found
      if (placedMineralIndex !== -1) {
        // Places the mineral on the scale
        const [placedMineralColor] = Object.entries(remainingMineralsCopy)[placedMineralIndex];
        remainingMineralsCopy[placedMineralColor]--;

        addToLog(`Placing mineral on ${side} side: ${placedMineralColor} - Quantity left: ${remainingMineralsCopy[placedMineralColor]}`);
        // Updates the main scale and the remaining minerals
        setMainScale(prevMainScale => {
          const newMainScale = [
            side === 'l' ? [...prevMainScale[0], `${placedMineralColor.charAt(0).toUpperCase() + placedMineralColor.slice(1)} ${remainingMineralsCopy[placedMineralColor] + 1}`] : [...prevMainScale[0]],
            side === 'r' ? [...prevMainScale[1], `${placedMineralColor.charAt(0).toUpperCase() + placedMineralColor.slice(1)} ${remainingMineralsCopy[placedMineralColor] + 1}`] : [...prevMainScale[1]],
          ];
          printBalanceInfo(newMainScale, remainingMineralsCopy);
          return newMainScale;
        });

        return remainingMineralsCopy;
      } else {
        addToLog(`No mineral found with the color ${color}.`);
        return prevRemainingMinerals;
      }
    });
  };

  // Function to play the game
  const main = () => {
    playRound();
  };

  // Function to open the color modal
  const openColorModal = () => {
    setColorModalVisible(true);
  };

  // Function to close the color modal
  const closeColorModal = () => {
    setColorModalVisible(false);
  };

  // Function to handle the color selection
  const handleColorSelect = async (color) => {
    setSelectedColor(color);
    addToLog(`Selected color: ${color}`);

    await placeMineral(color);
  };

  // Function to open the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Function to handle the guesses of the weights of the minerals
  const handleGuess = (guessedWeights) => {
    addToLog('Guessed weights:', guessedWeights);

    // Checks if the guessed weights are correct
    const guessedWeightsObj = guessedWeights;

    let allCorrect = true;

    for (const [color, weight] of Object.entries(guessedWeightsObj)) {
      const minerals = mainScale[0].concat(mainScale[1]);

      // Finds the mineral with the color and weight
      const mineralFound = minerals.find(mineral => mineral.toLowerCase().startsWith(color));

      // Checks if the mineral was found and if the weight is correct
      if (!mineralFound || parseInt(mineralFound.split(' ')[2], 10) !== weight) {
        allCorrect = false;
        break;
      } else {
        addToLog(`Correct guess: ${mineralFound} - Weight: ${weight} grams`);
      }
    }

    // Sends the data to the API
    if (allCorrect) {
      addToLog('Congratulations! You guessed correctly!');
    } else {
      addToLog('Sorry, one or more of your guesses are incorrect.');
    }
    closeModal();
  };


  // Use effect hook to run the main function when the component mounts
  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    // Función para desplazar el ScrollView hacia abajo cuando cambia su contenido
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [mensajes]); // Se activa cada vez que cambia el contenido del mensaje

  // Function to send the data to the API
  const sendDataToAPI = async () => {
    try {
      const mineralWeights = mainScale[0].concat(mainScale[1]).map(mineral => {
        const [color, weight] = mineral.split(' ');
        return { color: color.toLowerCase(), weight: parseInt(weight, 10) };
      });

      const requestData = {
        mineralWeights,
      };

      const response = await fetch('/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar datos al API:', error);
    }
  };

  // Function to update the winner of the game
  const updateGameWinner = async (gameId, winnerId) => {
    try {
      const requestData = {
        winner: winnerId,
      };

      const response = await fetch(`/game/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar datos al API:', error);
    }
  };

  // Función para crear un jugador
  const createPlayer = async (name) => {
    try {
      const requestData = {
        'name': name,
      };

      const response = await fetch('http://localhost:5001/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // No es necesario parsear la respuesta JSON porque ya estamos manejando una respuesta exitosa
      const data = await response.json();

      // Mostrar la respuesta del servidor
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      // Manejar errores
      console.error('Error al enviar datos al API:', error.message);
    }
  };



  // Function to update the points of a player
  const updatePlayerPoints = async (playerId, points) => {
    try {
      const requestData = {
        points,
      };

      const response = await fetch(`/player/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar datos al API:', error);
    }
  };


  // Returns the BalancingScales component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balancing Scales</Text>

      <Text>Player Name: {playerName}</Text>

      <ScrollView
        ref={scrollViewRef}
        style={styles.textareaContainer}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TextInput style={styles.textarea} value={mensajes} editable={false} multiline={true} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={openColorModal}>
          <Text style={styles.buttonText}>Place cubes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1, styles.leftButton]} onPress={openModal}>
          <Text style={styles.buttonText}>Guess weights</Text>
        </TouchableOpacity >
      </View >

      <GuessColorModal
        visible={modalVisible}
        onClose={closeModal}
        onGuess={handleGuess}
      />

      {
        colorModalVisible && (
          <MineralColorModal
            visible={colorModalVisible}
            onClose={closeColorModal}
            onSelectColor={handleColorSelect}
          />
        )
      }
    </View >
  );

};

export default BalancingScales;

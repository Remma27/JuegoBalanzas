/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
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
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [mainScale, setMainScale] = useState([[], []]);
  const scrollViewRef = useRef();
  const [mineralWeights, setMineralWeights] = useState(null);
  const [mineralNames, setMineralNames] = useState(null);
  const possibleWeights = Array.from({ length: 30 }, (_, i) => i + 1);
  const [remainingMinerals, setRemainingMinerals] = useState({ red: 2, yellow: 2, green: 2, blue: 2, violet: 2 });
  const [selectedColor, setSelectedColor] = useState(null);


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

  // Function to generate mineral weights and names
  const generateMineralWeights = () => {
    return new Promise((resolve, reject) => {
      const weights = [];
      const names = [];
      const colors = Object.keys(remainingMinerals);

      if (!Array.isArray(possibleWeights) || typeof remainingMinerals !== 'object' || remainingMinerals === null) {
        reject('Invalid data');
        return;
      }

      colors.forEach(color => {
        const count = remainingMinerals[color];
        if (typeof count === 'number' && count > 0) {
          const weight = possibleWeights[Math.floor(Math.random() * possibleWeights.length)];
          for (let i = 1; i <= count; i++) {
            const name = `${color.charAt(0).toUpperCase() + color.slice(1)} ${i}`;
            weights.push(weight);
            names.push(name);
          }
        }
      });

      if (weights.length > 0 && names.length > 0) {
        resolve({ weights, names });
      } else {
        reject('Error generating data');
      }
    });
  };

  const playRound = async () => {
    try {
      let currentMineralWeights, currentMineralNames;

      if (isFirstTurn) {
        const { weights, names } = await generateMineralWeights();
        currentMineralWeights = weights;
        currentMineralNames = names;

        setMineralWeights(currentMineralWeights);
        setMineralNames(currentMineralNames);

        const revealedMineralIndex = Math.floor(Math.random() * currentMineralWeights.length);
        const revealedWeight = currentMineralWeights[revealedMineralIndex];
        const revealedColor = currentMineralNames[revealedMineralIndex].split(' ')[0].toLowerCase();

        addToLog('--- New Round ---\n');
        addToLog('You have 2 minerals of each color: red, yellow, green, blue, and violet.');
        addToLog('Place the minerals on the scale and guess the weights.');
        addToLog('You can place the minerals on the left or right side of the scale.');
        addToLog('After placing the minerals, you can guess the weights.');
        addToLog(`Here’s a clue: The weight of ${revealedColor} minerals is ${revealedWeight} grams.`);
        addToLog('Good luck!');
        addToLog('\n--- Start ---\n');

        setIsFirstTurn(false);
        return;
      } else {
        currentMineralWeights = mineralWeights;
        currentMineralNames = mineralNames;
      }

      if (!Array.isArray(currentMineralWeights) || !Array.isArray(currentMineralNames)) {
        throw new Error("Mineral weights or names are not properly initialized.");
      }

      if (currentMineralWeights.length === 0 || currentMineralNames.length === 0) {
        throw new Error("No mineral weights or names were generated.");
      }

      if (currentMineralWeights.length !== currentMineralNames.length) {
        throw new Error("Mismatch between mineral weights and names.");
      }

      const revealedMineralIndex = Math.floor(Math.random() * currentMineralWeights.length);
      const revealedWeight = currentMineralWeights[revealedMineralIndex];
      const revealedName = currentMineralNames[revealedMineralIndex];

      if (typeof revealedWeight !== 'number' || typeof revealedName !== 'string') {
        throw new Error("Invalid revealed mineral data.");
      }
    } catch (error) {
      addToLog(`Error: ${error.message}`);
    }
  };

  // Function to print balance info
  const printBalanceInfo = (mainScale, remainingMinerals) => {
    const isEmpty = mainScale[0].length === 0 && mainScale[1].length === 0;

    if (!isEmpty) {
      const leftMinerals = mainScale[0];
      const rightMinerals = mainScale[1];

      const getWeightSum = (minerals) => {
        return minerals.reduce((totalWeight, mineral) => {
          const [name, quantityStr] = mineral.split(' ');
          const quantity = parseInt(quantityStr, 10);
          const weight = mineralWeights[mineralNames.indexOf(name)] || 0;
          return totalWeight + (weight * quantity);
        }, 0);
      };

      const weightLeft = getWeightSum(leftMinerals);
      const weightRight = getWeightSum(rightMinerals);

      addToLog('\nBalance\n');

      if (weightLeft === weightRight) {
        addToLog('The balance is even.');
      } else if (weightLeft > weightRight) {
        addToLog('The left side is heavier.');
      } else {
        addToLog('The right side is heavier.');
      }
    }

    addToLog('\nRemaining minerals:');
    Object.entries(remainingMinerals).forEach(([color, quantity]) => {
      const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
      addToLog(`${formattedColor}: ${quantity}`);
    });
    addToLog('\n-- End of round --\n');
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
        ]
      );
    });

    if (side !== 'l' && side !== 'r') {
      addToLog("Invalid side. Enter 'l' for left or 'r' for right.");
      return false;
    }

    setRemainingMinerals(prevMinerales => {
      const newMinerals = { ...prevMinerales };

      if (newMinerals[color.toLowerCase()] > 0) {
        newMinerals[color.toLowerCase()]--;

        addToLog(`Placing ${color} mineral on ${side === 'l' ? 'left' : 'right'} side. Quantity left: ${newMinerals[color.toLowerCase()]}`);

        setMainScale(prevMainScale => {
          const updatedScale = [...prevMainScale];
          const mineralName = `${color.charAt(0).toUpperCase() + color.slice(1)} ${newMinerals[color.toLowerCase()] + 1}`;

          if (side === 'l') {
            updatedScale[0] = [...updatedScale[0], mineralName];
          } else {
            updatedScale[1] = [...updatedScale[1], mineralName];
          }

          printBalanceInfo(updatedScale, newMinerals);
          return updatedScale;
        });

        return newMinerals;
      } else {
        addToLog(`No minerals left for the color ${color}.`);
        return prevMinerales;
      }
    });
  };

  const handleGuess = (guessedWeights) => {
    addToLog('Guessed weights:');
    Object.entries(guessedWeights).forEach(([color, weight]) => {
      addToLog(`- ${color}: ${weight} grams`);
    });

    let allCorrect = true;
    const weightMap = new Map();

    mineralNames.forEach((name, index) => {
      const [color] = name.split(' ');
      const weight = mineralWeights[index];
      weightMap.set(color.toLowerCase(), weight);
    });

    const details = [];

    Object.entries(guessedWeights).forEach(([color, guessedWeight]) => {
      const colorLower = color.toLowerCase();
      const correctWeight = weightMap.get(colorLower);

      if (correctWeight === undefined) {
        details.push(`${color}: Guessed weight ${guessedWeight} grams, but the correct weight was not found.`);
        allCorrect = false;
      } else if (parseInt(guessedWeight, 10) !== correctWeight) {
        details.push(`${color}: Guessed weight ${guessedWeight} grams, but the correct weight was ${correctWeight} grams.`);
        allCorrect = false;
      } else {
        addToLog(`Correct guess: ${color} - Weight: ${guessedWeight} grams`);
      }
    });

    if (allCorrect) {
      addToLog('Congratulations! All your guesses are correct!');
    } else {
      addToLog('Some of your guesses were incorrect. Here are the details:');
      details.forEach(detail => addToLog(`- ${detail}`));
    }

    closeModal();
  };

  // Use effect hook to run the main function when the component mounts
  useEffect(() => {
    playRound();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [mensajes]); // Desplaza hacia abajo cada vez que cambian los mensajes

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
    // Verifica si setSelectedColor está definido
    if (typeof setSelectedColor === 'function') {
      setSelectedColor(color);
      addToLog(`Selected color: ${color}`);
    }

    // Verifica si la función placeMineral está definida y es una función
    if (typeof placeMineral === 'function') {
      await placeMineral(color);
    }
  };

  // Function to open the modal
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
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

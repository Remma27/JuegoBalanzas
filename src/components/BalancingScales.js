/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */


import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'; // Importa TextInput para obtener la entrada del usuario// Importa TextInput para obtener la entrada del usuario
import GuessColorModal from './GuessColorModal';
import { styles } from '../css/styles';
import MineralColorModal from './MineralColorModal';


const BalancingScales = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajes, setMensajes] = useState('');
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [mainScale, setMainScale] = useState([[], []]); // [left_minerals, right_minerals]
  const [remainingMinerals, setRemainingMinerals] = useState({ red: 2, yellow: 2, green: 2, blue: 2, violet: 2 });

  const addToLog = message => {
    setMensajes(prevMensajes => prevMensajes + message + '\n');
    console.log(message);
  };

  async function showAlert(title, message, buttons) {
    return new Promise(resolve => {
      Alert.alert(title, message, buttons, { cancelable: false });
      resolve();
    });
  }

  // Define possible weights of minerals
  const possibleWeights = Array.from({ length: 30 }, (_, i) => i + 1); // Weights between 1 and 30 grams

  const generateMineralWeights = () => {
    const weights = [];
    const mineralNames = [];
    const colors = ['red', 'yellow', 'green', 'blue', 'violet'];

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


  const playRound = async () => {
    const [mineralWeights, mineralNames] = generateMineralWeights();
    const mainScaleCopy = [[...mainScale[0]], [...mainScale[1]]]; // Copia de la balanza actual
    const remainingMineralsCopy = { ...remainingMinerals }; // Copia de los minerales restantes

    // Reveal weight of a random mineral
    const revealedMineralIndex = Math.floor(Math.random() * 10);
    const revealedWeight = mineralWeights[revealedMineralIndex];
    const revealedColor = mineralNames[revealedMineralIndex].split(' ')[0].toLowerCase();
    addToLog(`The weight of ${revealedColor} minerals is: ${revealedWeight} grams`);

    // Actualizar el estado de la balanza y los minerales restantes
    setMainScale(mainScaleCopy);
    setRemainingMinerals(remainingMineralsCopy);

    // Imprimir la información inicial de la balanza y los minerales restantes
    if (isFirstTurn) {
      setIsFirstTurn(false);
    }
    printBalanceInfo(mainScaleCopy, remainingMineralsCopy);
  };

  const printBalanceInfo = (mainScale, remainingMinerals) => {
    // Check if the balance is empty
    const isEmpty = mainScale[0].length === 0 && mainScale[1].length === 0;

    // If the balance is not empty, print the balance information
    if (!isEmpty) {
      // Get minerals on each side of the balance
      const leftMinerals = mainScale[0].map(mineral => mineral.split(' ')[0]);
      const rightMinerals = mainScale[1].map(mineral => mineral.split(' ')[0]);

      // Calculate the difference in the number of minerals between both sides
      const balanceDifference = leftMinerals.length - rightMinerals.length;

      // Create a visual representation of the minerals on each side
      const visualLeft = getCountedMinerals(leftMinerals);
      const visualRight = getCountedMinerals(rightMinerals);

      // Print balance information
      addToLog('\nBalance\n');
      addToLog(`Left side: ${visualLeft}`);
      addToLog(`Right side: ${visualRight}`);

      // Print which side is heavier
      if (balanceDifference === 0) {
        addToLog('The balance is even.');
      } else if (balanceDifference > 0) {
        addToLog('The left side is heavier.');
      } else {
        addToLog('The right side is heavier.');
      }
    }

    // Print remaining minerals only if the balance is not empty
    if (!isEmpty) {
      addToLog('\nRemaining minerals:');
      for (const [color, quantity] of Object.entries(remainingMinerals)) {
        const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
        addToLog(`${formattedColor}: ${quantity}`);
      }
    }
  };

  const getCountedMinerals = (minerals) => {
    const mineralCounts = {};
    minerals.forEach(mineral => {
      mineralCounts[mineral] = (mineralCounts[mineral] || 0) + 1;
    });
    return Object.entries(mineralCounts).map(([mineral, count]) => `${count} ${mineral}`).join(', ');
  };

  const placeMineral = async (color) => {
    if (!color) {
      addToLog('Error: Please select a color.');
      return;
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

    if (side !== 'l' && side !== 'r') {
      addToLog("Invalid side. Enter 'l' for left or 'r' for right.");
      return;
    }

    setRemainingMinerals(prevRemainingMinerals => {
      const remainingMineralsCopy = { ...prevRemainingMinerals };

      const placedMineralIndex = Object.entries(remainingMineralsCopy).findIndex(([mineralColor, quantity]) => {
        return mineralColor.startsWith(color.toLowerCase()) && quantity > 0;
      });

      if (placedMineralIndex !== -1) {
        const [placedMineralColor] = Object.entries(remainingMineralsCopy)[placedMineralIndex];
        remainingMineralsCopy[placedMineralColor]--;

        addToLog(`Placing mineral on ${side} side: ${placedMineralColor} - Quantity left: ${remainingMineralsCopy[placedMineralColor]}`);

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

  const main = () => {
    playRound();
  };

  const openColorModal = () => {
    setColorModalVisible(true);
  };

  const closeColorModal = () => {
    setColorModalVisible(false);
  };

  const handleColorSelect = async (color) => {
    setSelectedColor(color); // Actualizar el estado de selectedColor
    addToLog(`Selected color: ${color}`);

    await placeMineral(color); // Llamar a placeMineral después de actualizar selectedColor
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleGuess = (guessedWeights) => {
    console.log('Guessed weights:', guessedWeights); // Verifica el valor de guessedWeights aquí

    // Convertir guessedWeights en un objeto
    const guessedWeightsObj = guessedWeights;

    // Inicializar una variable para rastrear si todas las adivinanzas son correctas
    let allCorrect = true;

    // Iterar sobre las adivinanzas para cada mineral
    for (const [color, weight] of Object.entries(guessedWeightsObj)) {
      // Obtener la lista de minerales en el lado correspondiente
      const minerals = mainScale[0].concat(mainScale[1]);

      // Verificar si el mineral está en la lista
      const mineralFound = minerals.find(mineral => mineral.toLowerCase().startsWith(color));

      // Si el mineral no está en la lista o si el peso es incorrecto, marcar la adivinanza como incorrecta
      if (!mineralFound || parseInt(mineralFound.split(' ')[2], 10) !== weight) {
        allCorrect = false;
        break; // No necesitamos seguir verificando si ya encontramos una adivinanza incorrecta
      }
    }

    // Log the result
    if (allCorrect) {
      addToLog('¡Adivinaste correctamente!');
    } else {
      addToLog('Lo siento, una o más de tus adivinanzas son incorrectas.');
    }

    // Close the modal
    closeModal();
  };


  useEffect(() => {
    main();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balancing Scales</Text>

      <ScrollView style={styles.textareaContainer} contentContainerStyle={styles.scrollViewContent}>
        <TextInput style={styles.textarea} value={mensajes} editable={false} multiline={true} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={openColorModal}>
          <Text style={styles.buttonText}>Colocar cubos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1, styles.leftButton]} onPress={openModal}>
          <Text style={styles.buttonText}>Adivinar pesos</Text>

        </TouchableOpacity>


      </View>

      <GuessColorModal
        visible={modalVisible}
        onClose={closeModal}
        onGuess={handleGuess}
      />

      {colorModalVisible && (
        <MineralColorModal
          visible={colorModalVisible}
          onClose={closeColorModal}
          onSelectColor={handleColorSelect}
        />
      )}
    </View>
  );

};

export default BalancingScales;

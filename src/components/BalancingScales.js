/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import GuessColorModal from './GuessColorModal';
import Textarea from 'react-native-textarea';
import { styles } from '../css/styles';
import { TextInput } from 'react-native';
import MineralColorModal from './MineralColorModal';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ViewPropTypes } from 'react-native';
import { ScrollView,props } from 'react-native';




const BalancingScales = ({ playerName }) => {

  
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajes, setMensajes] = useState('');
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [initialInfoPrinted, setInitialInfoPrinted] = useState(false);
  const [mainScale, setMainScale] = useState([[], []]); // [left_minerals, right_minerals]
  const [remainingMinerals, setRemainingMinerals] = useState({ red: 2, yellow: 2, green: 2, blue: 2, violet: 2 });
  const scrollViewRef = useRef();
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
    addToLog(`This is a clue: The weight of ${revealedColor} minerals is ${revealedWeight} grams.`);


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
    // Verificar si quedan minerales del color seleccionado
    if (remainingMinerals[color] <= 0) {
      // Mostrar un mensaje indicando que no hay minerales disponibles
      addToLog(`No ${color} minerals available.`);
      return false; // No se pudo colocar el mineral
    }
  
    // Si hay minerales disponibles, preguntar al usuario por el lado donde desea colocar el mineral
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
      return false; // No se pudo colocar el mineral
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

  const handleGuess = guessedCorrectly => {
    addToLog('Guessed correctly: ' + guessedCorrectly);
    closeModal();
  };

  useEffect(() => {
    main();
  }, []);

  useEffect(() => {
    // Función para desplazar el ScrollView hacia abajo cuando cambia su contenido
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [mensajes]); // Se activa cada vez que cambia el contenido del mensaje

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
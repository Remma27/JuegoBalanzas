/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import GuessColorModal from './GuessColorModal';
import Textarea from 'react-native-textarea';
import MineralColorModal from './MineralColorModal';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ViewPropTypes } from 'react-native';

const BalancingScales = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajes, setMensajes] = useState('');
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [initialInfoPrinted, setInitialInfoPrinted] = useState(false);
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

  const handleGuess = guessedCorrectly => {
    addToLog('Guessed correctly: ' + guessedCorrectly);
    closeModal();
  };

  useEffect(() => {
    main();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.tit_01}>Balancing Scales</Text>

      <View style={styles.textareaContainer}>
        <Textarea
          style={styles.textarea}
          defaultValue={mensajes}
          value={mensajes}
          editable={false}
          multiline={true}
          numberOfLines={10}
        />
      </View>

      <View style={styles.banda}>
        <TouchableOpacity
          style={styles.btn}
          onPress={openModal}
        >
          <Text style={styles.btnText}>Adivinar Pesos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnColor]}
          onPress={openColorModal}
        >
          <Text style={styles.btnText}>Colocar cubo</Text>
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

BalancingScales.propTypes = {
  styles: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  tit_01: {
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 10,
  },
  banda: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  textareaContainer: {
    padding: 5,
    borderColor: '#355DA8',
    borderWidth: 1,
    flex: 1,
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 5,
    borderColor: '#355DA8',
    borderWidth: 1,
    flex: 1,
  },
  btn: {
    backgroundColor: '#355DA8',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  btnColor: {
    backgroundColor: '#FFD700', // Cambiar color del segundo botón si es necesario
  },
});

export default BalancingScales;

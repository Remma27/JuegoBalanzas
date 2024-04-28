/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { View, Text, Button, TextInput, Alert } from 'react-native';
import GuessColorModal from './GuessColorModal';
import Textarea from 'react-native-textarea';
import MineralColorModal from './MineralColorModal';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ViewPropTypes } from 'react-native'; // Importa ViewPropTypes

const BalancingScales = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajes, setMensajes] = useState('');
  const [isFirstTurn, setIsFirstTurn] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const addToLog = message => {
    setMensajes(prevMensajes => prevMensajes + message + '\n');
    console.log(message);
  };

  // eslint-disable-next-line no-unused-vars
  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
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
      const weight =
        possibleWeights[Math.floor(Math.random() * possibleWeights.length)];
      for (let i = 1; i <= 2; i++) {
        const name = `${color.charAt(0).toUpperCase() + color.slice(1)} ${i}`;
        weights.push(weight);
        mineralNames.push(name);
      }
    });

    return [weights, mineralNames];
  };

  const playRound = async () => {
    const [mineralWeights, mineralNames] = generateMineralWeights();
    const mainScale = [[], []]; // [left_minerals, right_minerals]
    const remainingMinerals = { red: 2, yellow: 2, green: 2, blue: 2, violet: 2 };

    // Reveal weight of a random mineral
    const revealedMineralIndex = Math.floor(Math.random() * 10);
    const revealedWeight = mineralWeights[revealedMineralIndex];
    const revealedColor = mineralNames[revealedMineralIndex].split(' ')[0].toLowerCase();
    addToLog(`The weight of ${revealedColor} minerals is: ${revealedWeight} grams`);

    if (!isFirstTurn) {
      addToLog('\nMain scale:');
      addToLog('Left:', mainScale[0].join(', '));
      addToLog('Right:', mainScale[1].join(', '));
    } else {
      setIsFirstTurn(false);
    }

    const leftWeight = mainScale[0].reduce((acc, mineral) => acc + mineralWeights[mineralNames.indexOf(mineral)], 0);
    const rightWeight = mainScale[1].reduce((acc, mineral) => acc + mineralWeights[mineralNames.indexOf(mineral)], 0);

    if (!isFirstTurn) {
      if (leftWeight > rightWeight) {
        addToLog('The left side is heavier.');
      } else if (leftWeight < rightWeight) {
        addToLog('The right side is heavier.');
      } else {
        addToLog('The scale is balanced.');
      }
    }

    addToLog('\nRemaining minerals:');
    for (const [color, quantity] of Object.entries(remainingMinerals)) {
      addToLog(`${color.charAt(0).toUpperCase() + color.slice(1)}: ${quantity}`);
    }
  };

  const placeMineral = async (remainingMinerals, mineralNames, mainScale, mineralSelected) => {

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

    const placedMineralIndex = mineralNames.findIndex(mineral => mineral.toLowerCase().startsWith(mineralSelected) && !mainScale[0].includes(mineral) && !mainScale[1].includes(mineral));
    if (placedMineralIndex !== -1) {
      const placedMineral = mineralNames[placedMineralIndex];
      remainingMinerals[mineralSelected]--;
      if (side === 'l') {
        mainScale[0].push(placedMineral);
      } else {
        mainScale[1].push(placedMineral);
      }
    } else {
      addToLog(`No mineral found with the color ${mineralSelected}.`);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const guessWeights = async (mainScale, mineralNames, mineralWeights, remainingMinerals) => {
    if (mainScale[0].length !== mainScale[1].length) {
      addToLog('The scale is not balanced. You cannot guess the weights yet.');
      return;
    }

    const guesses = {};
    const incorrectGuesses = [];

    for (let i = 0; i < mineralNames.length; i++) {
      const color = mineralNames[i].split(' ')[0].toLowerCase();
      if (!guesses[color]) {
        let guess;
        do {
          const input = await new Promise(resolve => {
            showAlert(`Enter your estimation for the weight of ${color} minerals:`, '')
              // eslint-disable-next-line no-shadow
              .then(input => resolve(input.trim())); // Elimina los espacios en blanco del inicio y final
          });
          const parsedInput = parseInt(input, 10);
          if (!isNaN(parsedInput)) {
            guess = parsedInput;
          } else {
            addToLog('Error: Please enter a valid integer.');
          }
        } while (isNaN(guess) || guess === null); // Continuar solicitando la entrada hasta que sea un número entero válido
        guesses[color] = guess;
      }
    }

    // Compare guessed weights with the actual ones
    for (const [color, guessedWeight] of Object.entries(guesses)) {
      if (guessedWeight !== mineralWeights[mineralNames.indexOf(`${color.charAt(0).toUpperCase() + color.slice(1)} 1`)]) {
        incorrectGuesses.push(color);
      }
    }

    if (incorrectGuesses.length === 0) {
      addToLog('Congratulations! You have correctly guessed all the weights.');
    } else {
      addToLog('Sorry, you failed to guess the weight of the following minerals:');
      incorrectGuesses.forEach(color => addToLog(color.charAt(0).toUpperCase() + color.slice(1)));
      addToLog('You lost the round.');
      addToLog('The real weights of the minerals are:');
      const printedColors = new Set();
      for (let i = 0; i < mineralNames.length; i++) {
        const color = mineralNames[i].split(' ')[0].toLowerCase();
        if (remainingMinerals[color] && !printedColors.has(color)) {
          addToLog(`The ${color} minerals weigh: ${mineralWeights[i]} grams`);
          printedColors.add(color);
        }
      }
    }
  };


  // eslint-disable-next-line no-unused-vars
  const resetGame = () => {
    const playAgain = showAlert('Do you want to play again? (y/n): ', '', [
      {
        text: 'Yes',
        onPress: () => {
          addToLog('playAgain');
          return 'y';
        },
      },
      { text: 'No', onPress: () => 'n' },
    ]);

    if (playAgain === 'y') {
      setIsFirstTurn(true);
      main();
    } else {
      addToLog('Game over.');
    }
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

  const handleColorSelect = async color => {
    setSelectedColor(color);
    addToLog(`Selected color: ${color}`);

    // Mostrar la pregunta para elegir el lado
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

    // Llama a la función para colocar el mineral después de elegir el lado
    // eslint-disable-next-line no-undef
    await placeMineral(remainingMinerals, mineralNames, mainScale, color, side);
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
          <Text style={styles.btnText}>Seleccionar Color</Text>
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

/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native'; // Importa TextInput para obtener la entrada del usuario
import GuessColorModal from './GuessColorModal';
import Textarea from 'react-native-textarea';
import { styles } from '../css/styles';
import { ScrollView } from 'react-native';



const BalancingScales = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [mensajes, setMensajes] = useState('');
    const [userInput, setUserInput] = useState(''); // Estado para almacenar la entrada del usuario
    const [isFirstTurn, setIsFirstTurn] = useState(true);

    const addToLog = (message) => {
        setMensajes(prevMensajes => prevMensajes + message + '\n');
        console.log(message);
    };

    async function showAlert(title, message, buttons, options) {
        return new Promise((resolve) => {
            Alert.alert(
                title,
                message,
                buttons,
                options
            );
            const handlePress = (buttonIndex) => {
                resolve(buttons[buttonIndex].onPress());
            };
            Alert.alert(title, message, buttons, options, handlePress);
            console.log('Alerta:', title, message, buttons, options);
            console.log('Resolve:', resolve);
            console.log('HandlePress:', handlePress);
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

        let roundOver = false;
        let numIterations = 0;
        const maxIterations = 5; // Definir un número máximo de iteraciones para evitar bucles infinitos

        while (!roundOver && numIterations < maxIterations) {
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

            let option;
            do {
                option = await showAlert(
                    'Options',
                    "Enter 'p' to place a mineral or 'g' to guess the weights:",
                    [
                        { text: 'Place a mineral', onPress: () => { option = 'p'; } },
                        { text: 'Guess the weights', onPress: () => { option = 'g'; } },
                    ],
                    { cancelable: false }
                );
                console.log('Option:', option);
            } while (option !== 'p' && option !== 'g');

            console.log('Option:', option);


            switch (option) {
                case 'p':
                    const mineralColor = showAlert(
                        'Enter Mineral Color',
                        'Choose the color of the mineral you want to place:',
                        [
                            { text: 'Red', onPress: () => 'red' },
                            { text: 'Yellow', onPress: () => 'yellow' },
                            { text: 'Green', onPress: () => 'green' },
                            { text: 'Blue', onPress: () => 'blue' },
                            { text: 'Violet', onPress: () => 'violet' },
                        ],
                        { cancelable: false }
                    );

                    if (!(mineralColor in remainingMinerals) || remainingMinerals[mineralColor] === 0) {
                        addToLog('There are no minerals available in that color.');
                        continue;
                    }

                    const side = showAlert(
                        'Enter Side',
                        'Choose the side where you want to place the mineral:',
                        [
                            { text: 'Left', onPress: () => 'l' },
                            { text: 'Right', onPress: () => 'r' },
                        ],
                        { cancelable: false }
                    );

                    if (side !== 'l' && side !== 'r') {
                        addToLog('Invalid side. Enter \'l\' for left or \'r\' for right.');
                        continue;
                    }

                    const placedMineralIndex = mineralNames.findIndex(mineral => mineral.toLowerCase().includes(mineralColor) && !mainScale[0].includes(mineral) && !mainScale[1].includes(mineral));
                    if (placedMineralIndex !== -1) {
                        const placedMineral = mineralNames[placedMineralIndex];
                        remainingMinerals[mineralColor]--;
                        if (side === 'l') {
                            mainScale[0].push(placedMineral);
                        } else {
                            mainScale[1].push(placedMineral);
                        }
                    }
                    break;

                case 'g':
                    // Implementa la lógica para adivinar los pesos
                    // Aqui hay que llamar a la modal que hizo jose, jalar los datos a la modal y regresar el resultado
                    if (mainScale[0].length !== mainScale[1].length) {
                        addToLog('The scale is not balanced. You cannot guess the weights yet.');
                        continue;
                    }

                    const guesses = {};
                    const incorrectGuesses = [];
                    for (let i = 0; i < 10; i++) {
                        const color = mineralNames[i].split(' ')[0].toLowerCase();
                        if (!(color in guesses)) {
                            let guess;
                            while (isNaN(guess) || guess === null) {
                                const input = showAlert(`Enter your estimation for the weight of ${color} minerals:`, '');
                                const parsedInput = parseInt(input, 10);
                                if (!isNaN(parsedInput)) {
                                    guess = parsedInput;
                                } else {
                                    addToLog('Error: Please enter a valid integer.');
                                }
                            }
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
                        roundOver = true;
                    } else {
                        addToLog('Sorry, you failed to guess the weight of the following minerals:');
                        incorrectGuesses.forEach(color => console.log(color.charAt(0).toUpperCase() + color.slice(1)));
                        addToLog('You lost the round.');
                        addToLog('The real weights of the minerals are:');
                        const printedColors = new Set();
                        for (let i = 0; i < mineralNames.length; i++) {
                            const color = mineralNames[i].split(' ')[0].toLowerCase();
                            if (color in remainingMinerals && !printedColors.has(color)) {
                                addToLog(`The ${color} minerals weigh: ${mineralWeights[i]} grams`);
                                printedColors.add(color);
                            }
                        }
                        roundOver = true;
                    }
                    break;

                default:
                    addToLog("Invalid option. Enter 'p' or 'g'.");
                    break;
            }

            numIterations++;
        }

        if (numIterations >= maxIterations) {
            addToLog('The maximum number of iterations has been reached.');
        }

        if (roundOver) {
            resetGame();
        }
    };

    const resetGame = () => {
        const playAgain = showAlert('Do you want to play again? (y/n): ', '', [
            { text: 'Yes', onPress: () => { addToLog('playAgain'); return 'y'; } },
            { text: 'No', onPress: () => 'n' },
        ]);

        if (playAgain === 'y') {
            setIsFirstTurn(true);
            main();
        } else {
            addToLog('Game over.');
        }
    };

    //Ejecuta la primer vez que abre la app
    //En teoria tiene que llamar a main(), y en el [] de abajo tiene que estar main, pero algo pasa con los alerts que sobre carga la aplicacion, la relentiza y la cierra
    //Entonces una propuesta es hacer los propios modales
    const main = () => {
        playRound();
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleGuess = (guessedCorrectly) => {
        addToLog('Guessed correctly: ' + guessedCorrectly);
        closeModal();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Balancing Scales</Text>

            <ScrollView style={styles.textareaContainer}>
                <Textarea
                    style={styles.textarea}
                    value={mensajes}
                    editable={false}
                />
            </ScrollView>

            <Button title="Adivinar colores" onPress={openModal} />
            <GuessColorModal visible={modalVisible} onClose={closeModal} onGuess={handleGuess} />

            {/* TextInput para obtener la entrada del usuario */}
            <TextInput
                value={userInput} // Usa el estado userInput aquí
                style={styles.texto}
                multiline={true}
                placeholder="Escribe aquí..."
                onChangeText={(newValue) => setUserInput(newValue)}
            />
            <Button
                title="Iniciar juego"
                onPress={() => {

                    main();
                    //addToLog(userInput);
                    //setUserInput(''); // Limpia el estado userInput después de agregarlo a los mensajes
                }}
            />
        </View>
    );

};

export default BalancingScales;

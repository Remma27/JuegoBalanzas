/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';

const ColorInput = ({ color, value, onChangeText }) => {
    const handleChangeText = (text) => {
        if (/^\d+$/.test(text) && parseInt(text, 10) >= 1 && parseInt(text, 10) <= 30) {
            onChangeText(color, text);
        }
    };

    return (
        <TextInput
            placeholder={'Enter '}
            onChangeText={handleChangeText}
            value={value}
            keyboardType="numeric"
            style={[guessStyles.input, { backgroundColor: getColor(color) }]}
        />
    );
};

//getColor function with color parameter and switch statement
const getColor = (color) => {
    switch (color) {
        case 'red':
            return '#FF5733';
        case 'blue':
            return '#3498DB';
        case 'green':
            return '#27AE60';
        case 'yellow':
            return '#F9BF3B';
        case 'violet':
            return '#9B59B6';
        default:
            return '#DDDDDD';
    }
};

//GuessColorModal component with props visible, onClose, and onGuess
const GuessColorModal = ({ visible, onClose, onGuess }) => {
    //useState hook with colorValues and setColorValues
    const [colorValues, setColorValues] = useState({
        red: null,
        blue: null,
        green: null,
        yellow: null,
        violet: null,
    });

    useEffect(() => {
        if (!visible) {
            // Clear input values when the modal is closed
            setColorValues({
                red: '',
                blue: '',
                green: '',
                yellow: '',
                violet: '',
            });
        }
    }, [visible]);

    const handleGuess = () => {
        // Check if all inputs have a value
        const allInputsFilled = Object.values(colorValues).every(value => value.trim() !== '');
        if (!allInputsFilled) {
            Alert.alert('All fields are required', 'Please fill in all fields.');
            return;
        }

        // Check if all inputs contain valid numbers between 1 and 30
        const isValidNumber = Object.values(colorValues).every(value => /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 30);
        if (!isValidNumber) {
            Alert.alert('Invalid numbers', 'Please enter valid numbers between 1 and 30 in all fields.');
            return;
        }

        // If all inputs are valid, call the onGuess function
        const guessedValues = Object.values(colorValues);
        onGuess(guessedValues);
    };

    //handleColorValueChange function with color and value parameters
    const handleColorValueChange = (color, value) => {
        setColorValues((prevState) => ({ ...prevState, [color]: parseInt(value, 10) }));
    };

    //Modal component
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={guessStyles.centeredView}>
                <View style={guessStyles.modalView}>
                    <TouchableOpacity style={guessStyles.closeButton} onPress={onClose}>
                        <Text style={guessStyles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                    <Text style={guessStyles.modalText}>
                        Enter the number corresponding to each color:
                    </Text>
                    {Object.keys(colorValues).map((color) => (
                        <ColorInput
                            key={color}
                            color={color}
                            value={colorValues[color] !== null ? String(colorValues[color]) : ''}
                            onChangeText={handleColorValueChange}
                        />
                    ))}
                    <View style={guessStyles.buttonsContainer}>
                        <TouchableOpacity
                            style={[guessStyles.button, guessStyles.guessButton]}
                            onPress={handleGuess}
                        >
                            <Text style={guessStyles.buttonText}>Guess</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const guessStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        width: 100,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        width: '48%',
    },
    guessButton: {
        backgroundColor: '#2196F3',
    },
    closeButton: {
        backgroundColor: '#FF6347',
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GuessColorModal;

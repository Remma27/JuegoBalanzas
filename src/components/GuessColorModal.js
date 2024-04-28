/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';

const ColorInput = ({ color, value, onChangeText }) => (
    <TextInput
        placeholder={color.charAt(0).toUpperCase() + color.slice(1)}
        onChangeText={(text) => onChangeText(color, text)}
        value={value}
        keyboardType="numeric"
        style={guessStyles.input}
    />
);

const GuessColorModal = ({ visible, onClose, onGuess }) => {
    const [colorValues, setColorValues] = useState({
        red: '',
        blue: '',
        green: '',
        yellow: '',
        violet: '',
    });

    const correctAnswers = {
        red: '1',
        blue: '2',
        green: '1',
        yellow: '2',
        violet: '1',
    };

    const handleGuess = () => {
        const guessedCorrectly = Object.entries(colorValues).every(
            ([color, value]) => value === correctAnswers[color]
        );
        onGuess(guessedCorrectly);
    };

    const handleColorValueChange = (color, value) => {
        setColorValues((prevState) => ({ ...prevState, [color]: value }));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={guessStyles.centeredView}>
                <View style={guessStyles.modalView}>
                    <Text style={guessStyles.modalText}>
                        Ingresa el número correspondiente a cada color:
                    </Text>
                    {Object.keys(colorValues).map((color) => (
                        <ColorInput
                            key={color}
                            color={color}
                            value={colorValues[color]}
                            onChangeText={handleColorValueChange}
                        />
                    ))}
                    <View style={guessStyles.buttonsContainer}>
                        <TouchableOpacity
                            style={guessStyles.button}
                            onPress={handleGuess}
                        >
                            <Text style={guessStyles.buttonText}>Adivinar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={guessStyles.button}
                            onPress={onClose}
                        >
                            <Text style={guessStyles.buttonText}>Cerrar</Text>
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
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Cambiar a 'center' para centrar los botones horizontalmente
        width: '100%',
        justifyContent: 'space-around', // Agregar separación entre los botones
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GuessColorModal;

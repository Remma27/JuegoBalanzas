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
            placeholder={color.charAt(0).toUpperCase() + color.slice(1)}
            onChangeText={handleChangeText}
            value={value}
            keyboardType="numeric"
            style={guessStyles.input}
        />
    );
};

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

const GuessColorModal = ({ visible, onClose, onGuess }) => {
    const [colorValues, setColorValues] = useState({
        red: '',
        blue: '',
        green: '',
        yellow: '',
        violet: '',
    });

    useEffect(() => {
        if (!visible) {
            // Limpiar los valores de los inputs cuando se cierre la modal
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
        // Verificar si todos los inputs tienen un valor
        const allInputsFilled = Object.values(colorValues).every(value => value.trim() !== '');
        if (!allInputsFilled) {
            Alert.alert('Todos los campos son obligatorios', 'Por favor, complete todos los campos.');
            return;
        }

        // Verificar si todos los inputs contienen números válidos entre 1 y 30
        const isValidNumber = Object.values(colorValues).every(value => /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 30);
        if (!isValidNumber) {
            Alert.alert('Números inválidos', 'Por favor, ingrese números válidos entre 1 y 30 en todos los campos.');
            return;
        }

        // Si todos los inputs son válidos, llamar a la función onGuess
        const guessedValues = Object.values(colorValues);
        onGuess(guessedValues);
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
                            style={[guessStyles.button, guessStyles.guessButton]}
                            onPress={handleGuess}
                        >
                            <Text style={guessStyles.buttonText}>Adivinar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[guessStyles.button, guessStyles.closeButton]}
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
        width: '48%', // Ajusta el ancho de los botones
    },
    guessButton: {
        backgroundColor: '#2196F3',
    },
    closeButton: {
        backgroundColor: '#FF6347', // Color rojo para cerrar
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default GuessColorModal;
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { Alert } from 'react-native';

const ColorInput = ({ color, value, onChangeText }) => (
    <TextInput
        placeholder={color.charAt(0).toUpperCase() + color.slice(1)}
        onChangeText={(text) => onChangeText(color, text)}
        value={value}
        keyboardType="numeric"
        style={[guessStyles.input, { backgroundColor: getColor(color) }]}
    />
);

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
        red: null,
        blue: null,
        green: null,
        yellow: null,
        violet: null,
    });

    const handleGuess = () => {
        const allInputsFilled = Object.values(colorValues).every(value => value !== null);
        if (!allInputsFilled) {
            Alert.alert('All fields are mandatory', 'Please complete all fields.');
            return;
        }

        const guessedValues = colorValues;
        onGuess(guessedValues);
    };

    const handleColorValueChange = (color, value) => {
        setColorValues((prevState) => ({ ...prevState, [color]: parseInt(value, 10) }));
    };

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
        width: '48%', // Adjust button width
    },
    guessButton: {
        backgroundColor: '#2196F3',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
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

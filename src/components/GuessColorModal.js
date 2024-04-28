import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';

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
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Modal, Button } from 'react-native';
import { TextInput } from 'react-native';
import { styles } from '../css/styles';

const ColorInput = ({ color, value, onChangeText }) => (
    <TextInput
        placeholder={color.charAt(0).toUpperCase() + color.slice(1)}
        onChangeText={(text) => onChangeText(color, text)}
        value={value}
        keyboardType="numeric"
        style={styles.input}
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
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>
                        Ingresa el número correspondiente a cada color:
                    </Text>
                    {Object.keys(colorValues).map((color) => (
                        <ColorInput style={styles.input}
                            key={color}
                            color={color}
                            value={colorValues[color]}
                            onChangeText={handleColorValueChange}
                        />
                    ))}
                    <View style={styles.buttonsContainer}>
                        <Button title="Adivinar" onPress={handleGuess} />
                        <Button title="Cerrar" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};



export default GuessColorModal;

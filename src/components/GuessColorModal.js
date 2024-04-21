import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

const GuessColorModal = ({ visible, onClose, onGuess }) => {
    const [redValue, setRedValue] = useState('');
    const [blueValue, setBlueValue] = useState('');
    const [greenValue, setGreenValue] = useState('');
    const [yellowValue, setYellowValue] = useState('');
    const [violetValue, setVioletValue] = useState('');

    const handleGuess = () => {
        const guessedCorrectly = redValue === '1' && blueValue === '2'
            && greenValue === '1' && yellowValue === '2' && violetValue === '1';
        onGuess(guessedCorrectly);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <Text>Ingresa el número correspondiente a cada color:</Text>
                    <TextInput
                        placeholder="Rojo"
                        onChangeText={setRedValue}
                        value={redValue}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Azul"
                        onChangeText={setBlueValue}
                        value={blueValue}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Verde"
                        onChangeText={setGreenValue}
                        value={greenValue}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Amarillo"
                        onChangeText={setYellowValue}
                        value={yellowValue}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <TextInput
                        placeholder="Violeta"
                        onChangeText={setVioletValue}
                        value={violetValue}
                        keyboardType="numeric"
                        style={{ borderBottomWidth: 1, marginBottom: 10 }}
                    />
                    <Button title="Adivinar" onPress={handleGuess} />
                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default GuessColorModal;

/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { cap, COLOR_ES } from '../game/rules';

const COLORS = ['red', 'blue', 'green', 'yellow', 'violet'];
const COLOR_HEX = {
  red: '#E53935',
  yellow: '#FDD835',
  green: '#43A047',
  blue: '#1E88E5',
  violet: '#8E24AA',
};

const ColorInput = ({ color, value, onChangeText }) => (
  <View style={styles.inputRow}>
    <View style={[styles.colorDot, { backgroundColor: COLOR_HEX[color] }]}>
      <Text style={styles.colorDotText}>{cap(COLOR_ES[color])}</Text>
    </View>
    <TextInput
      placeholder="Peso (g)"
      placeholderTextColor="#999"
      onChangeText={text => onChangeText(color, text)}
      value={value}
      keyboardType="numeric"
      style={styles.input}
    />
  </View>
);

const GuessColorModal = ({ visible, onClose, onGuess }) => {
  const [colorValues, setColorValues] = useState({
    red: null,
    blue: null,
    green: null,
    yellow: null,
    violet: null,
  });

  useEffect(() => {
    if (visible) {
      setColorValues({ red: null, blue: null, green: null, yellow: null, violet: null });
    }
  }, [visible]);

  const handleGuess = () => {
    const allInputsFilled = Object.values(colorValues).every(v => v !== null);
    if (!allInputsFilled) {
      Alert.alert('Todos los campos son obligatorios', 'Por favor completa todos los campos.');
      return;
    }
    onGuess(colorValues);
  };

  const handleChange = (color, value) => {
    setColorValues(prev => ({ ...prev, [color]: value === '' ? null : parseInt(value, 10) }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.centered}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Adivina los pesos</Text>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Ingresa el peso en gramos de cada color:</Text>

          {COLORS.map(color => (
            <ColorInput
              key={color}
              color={color}
              value={colorValues[color] !== null ? String(colorValues[color]) : ''}
              onChangeText={handleChange}
            />
          ))}

          <TouchableOpacity style={styles.guessButton} onPress={handleGuess}>
            <Text style={styles.guessButtonText}>Adivinar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: 13,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorDot: {
    width: 86,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  colorDotText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  guessButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  guessButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GuessColorModal;
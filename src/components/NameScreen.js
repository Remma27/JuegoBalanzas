/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const NameScreen = ({ onDone }) => {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚖️ Balanzas</Text>
      <Text style={styles.subtitle}>¿Cómo te llamas?</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
        autoFocus
        maxLength={20}
      />
      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.disabled]}
        disabled={!name.trim()}
        onPress={() => onDone(name.trim())}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    height: 48,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default NameScreen;
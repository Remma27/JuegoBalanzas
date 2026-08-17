/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR_ES } from '../game/rules';

const COLOR_HEX = {
  red: '#E53935',
  yellow: '#FDD835',
  green: '#43A047',
  blue: '#1E88E5',
  violet: '#8E24AA',
};

const GuessResultModal = ({ visible, results, allCorrect, onClose }) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.centered}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: allCorrect ? '#2E7D32' : '#C62828' }]}>
            {allCorrect ? '¡Felicidades!' : 'Resultado'}
          </Text>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          {allCorrect
            ? 'Todos los pesos son correctos.'
            : 'Algunos pesos son incorrectos:'}
        </Text>

        {results.map(r => (
          <View key={r.color} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: COLOR_HEX[r.color] }]} />
            <Text style={styles.colorName}>{COLOR_ES[r.color]}</Text>
            {r.ok ? (
              <View style={[styles.badge, styles.badgeOk]}>
                <Text style={styles.badgeOkText}>Correcto</Text>
              </View>
            ) : (
              <View style={styles.miss}>
                <Text style={styles.missText}>
                  Adivinaste {r.guessedWeight} g · era {r.correctWeight} g
                </Text>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.ok} onPress={onClose}>
          <Text style={styles.okText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    fontSize: 22,
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
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 10,
  },
  colorName: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOk: {
    backgroundColor: '#C8E6C9',
  },
  badgeOkText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 13,
  },
  miss: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  missText: {
    color: '#C62828',
    fontSize: 13,
    fontWeight: '600',
  },
  ok: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  okText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GuessResultModal;
/* eslint-disable prettier/prettier */
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const RULES = `1- Los jugadores reciben 10 minerales de diferentes colores (2 de cada color) con pesos entre 1 y 30 gramos, y deben colocarlos en la balanza para equilibrarla.

2- Los jugadores reciben información sobre un mineral al comienzo del juego.

3- Usan dos balanzas, una principal y una secundaria, para colocar los minerales.

4- En cada turno, los jugadores deben colocar al menos dos minerales en la balanza principal en un lapso de cinco minutos.

5- Los jugadores no pueden intercambiar ni transferir minerales, ni retirarlos de la balanza.

6- Cuando la balanza principal está equilibrada, los jugadores pueden pagar para adivinar el peso de cada mineral.

7- Si adivinan correctamente, ganan dos premios, pero si algún acierto es incorrecto, pierden la ficha pagada.

8- El juego termina cuando ningún jugador puede colocar más minerales en la balanza.

9- Si la balanza está equilibrada al final y todos los pesos se adivinan correctamente, se suman 100 millones de wones al premio final; de lo contrario, termina en fracaso sin premios adicionales.`;

const RulesModal = ({ visible, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={styles.centered}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Reglas del juego</Text>
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text style={styles.rules}>{RULES}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.ok} onPress={onClose}>
          <Text style={styles.okText}>Entendido</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  rules: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  ok: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  okText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RulesModal;
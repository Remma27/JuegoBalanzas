/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Scale from './Scale';
import MineralCube from './MineralCube';
import GuessColorModal from './GuessColorModal';
import GuessResultModal from './GuessResultModal';
import {
  COLORS,
  createRemaining,
  generateMineralWeights,
  cap,
  isBalanced,
  checkGuess,
  sideWeight,
  COLOR_ES,
} from '../game/rules';

const BalancingScales = ({ playerName }) => {
  const [guessModalVisible, setGuessModalVisible] = useState(false);
  const [mainScale, setMainScale] = useState([[], []]);
  const [mineralWeights, setMineralWeights] = useState(null);
  const [mineralNames, setMineralNames] = useState(null);
  const [remainingMinerals, setRemainingMinerals] = useState(createRemaining());
  const [dropZones, setDropZones] = useState({ left: null, right: null });
  const [revealed, setRevealed] = useState(null);
  const [guessResult, setGuessResult] = useState(null);

  useEffect(() => {
    generateMineralWeights(createRemaining()).then(({ weights, names }) => {
      setMineralWeights(weights);
      setMineralNames(names);
      const idx = Math.floor(Math.random() * weights.length);
      setRevealed({
        color: names[idx].split(' ')[0].toLowerCase(),
        weight: weights[idx],
      });
    });
  }, []);

  const statusText = () => {
    if (mainScale[0].length === 0 && mainScale[1].length === 0) {
      return 'Arrastra los minerales a los platillos';
    }
    const leftW = sideWeight(mainScale[0], mineralNames || [], mineralWeights || []);
    const rightW = sideWeight(mainScale[1], mineralNames || [], mineralWeights || []);
    if (Math.abs(leftW - rightW) < 0.001) {
      return 'La balanza está equilibrada';
    }
    return leftW > rightW ? 'El lado izquierdo pesa más' : 'El lado derecho pesa más';
  };

  const handleDrop = (color, side) => {
    if (remainingMinerals[color] <= 0) return;

    setRemainingMinerals(prev => {
      const next = { ...prev };
      if (next[color] <= 0) return prev;
      next[color]--;

      setMainScale(prevScale => {
        const updated = [...prevScale];
        const mineralName = `${cap(color)} ${next[color] + 1}`;
        updated[side === 'l' ? 0 : 1] = [...updated[side === 'l' ? 0 : 1], mineralName];
        return updated;
      });

      return next;
    });
  };

  const handleGuess = guessedWeights => {
    const { allCorrect, results } = checkGuess(
      guessedWeights,
      mineralNames || [],
      mineralWeights || []
    );
    setGuessResult({ allCorrect, results });
    setGuessModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balanzas</Text>
      <Text style={styles.player}>Jugador: {playerName}</Text>

      {revealed && (
        <View style={styles.clueCard}>
          <Text style={styles.clueLabel}>Pista</Text>
          <Text style={styles.clueText}>
            Los minerales {COLOR_ES[revealed.color]} pesan {revealed.weight} g
          </Text>
        </View>
      )}

      <Scale
        scale={mainScale}
        leftWeight={sideWeight(mainScale[0], mineralNames || [], mineralWeights || [])}
        rightWeight={sideWeight(mainScale[1], mineralNames || [], mineralWeights || [])}
        onZoneChange={(which, rect) => setDropZones(prev => ({ ...prev, [which]: rect }))}
      />

      <Text style={[styles.status, isBalanced(mainScale, mineralNames || [], mineralWeights || []) ? styles.statusOk : null]}>
        {statusText()}
      </Text>

      <View style={styles.tray}>
        {COLORS.map(color => (
          <MineralCube
            key={color}
            color={color}
            count={remainingMinerals[color]}
            dropZones={dropZones}
            onPlace={handleDrop}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.guessButton} onPress={() => setGuessModalVisible(true)}>
        <Text style={styles.guessButtonText}>Adivinar pesos</Text>
      </TouchableOpacity>

      <GuessColorModal
        visible={guessModalVisible}
        onClose={() => setGuessModalVisible(false)}
        onGuess={handleGuess}
      />

      {guessResult && (
        <GuessResultModal
          visible
          results={guessResult.results}
          allCorrect={guessResult.allCorrect}
          onClose={() => setGuessResult(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  player: {
    fontSize: 14,
    marginBottom: 10,
  },
  clueCard: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  clueLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1565C0',
    textTransform: 'uppercase',
  },
  clueText: {
    fontSize: 15,
    color: '#333',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  statusOk: {
    color: '#2E7D32',
  },
  tray: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  guessButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 4,
  },
  guessButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BalancingScales;
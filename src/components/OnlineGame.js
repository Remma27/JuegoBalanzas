/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { io } from 'socket.io-client';
import Scale from './Scale';
import MineralCube from './MineralCube';
import GuessColorModal from './GuessColorModal';
import GuessResultModal from './GuessResultModal';
import { COLORS, COLOR_ES } from '../game/rules';

const SERVER_URL = Platform.select({
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

const OnlineGame = ({ playerName, onExit }) => {
  const socketRef = useRef(null);
  const [phase, setPhase] = useState('lobby');
  const [state, setState] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [code, setCode] = useState(null);
  const [guessVisible, setGuessVisible] = useState(false);
  const [guessResult, setGuessResult] = useState(null);
  const [dropZones, setDropZones] = useState({ left: null, right: null });

  const myIndex = useMemo(() => (isHost ? 0 : 1), [isHost]);
  const isMyTurn = state ? state.turn === myIndex : false;
  const balanced =
    state && Math.abs(state.leftWeight - state.rightWeight) < 0.001 && state.scale[0].length > 0;

  useEffect(() => {
    const socket = io(SERVER_URL);
    socketRef.current = socket;

    socket.on('roomJoined', data => {
      setIsHost(data.isHost);
      setCode(data.code);
      setState(data);
      if (data.players.length >= 2) {
        setPhase('playing');
        Alert.alert(
          '¡Partida encontrada!',
          `Sala ${data.code}\n${data.players.join(' vs ')}\n\n` +
            `Pista: el peso de los minerales ${COLOR_ES[data.revealed.color]} es ${data.revealed.weight} gramos.`
        );
      } else {
        setPhase('waiting');
      }
    });

    socket.on('state', data => setState(data));

    socket.on('guessResult', ({ allCorrect, results, by }) => {
      setGuessVisible(false);
      setGuessResult({ allCorrect, results, by });
    });

    socket.on('gameOver', () => {
      Alert.alert('Fin de la partida', 'La partida terminó.', [
        { text: 'OK', onPress: onExit },
      ]);
    });

    socket.on('opponentLeft', () => {
      Alert.alert('Tu oponente se fue', 'La partida se canceló.', [
        { text: 'OK', onPress: onExit },
      ]);
    });

    socket.on('error', ({ msg }) => Alert.alert('Aviso', msg));

    return () => {
      socket.disconnect();
    };
  }, [onExit]);

  const createRoom = () => socketRef.current.emit('createRoom', { name: playerName });
  const matchmaking = () => socketRef.current.emit('matchmaking', { name: playerName });
  const joinRoom = () => {
    if (codeInput.trim()) {
      socketRef.current.emit('joinRoom', { code: codeInput.trim(), name: playerName });
    }
  };

  const handleDrop = (color, side) => {
    if (!isMyTurn) {
      Alert.alert('Aviso', 'No es tu turno.');
      return;
    }
    socketRef.current.emit('placeMineral', { code, color, side });
  };

  const handleGuess = guesses => {
    socketRef.current.emit('guess', { code, guesses });
  };

  if (phase === 'lobby') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Multijugador</Text>
        <Text style={styles.player}>Jugador: {playerName}</Text>

        <TouchableOpacity style={[styles.button, styles.primary]} onPress={createRoom}>
          <Text style={styles.buttonText}>Crear sala</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={matchmaking}>
          <Text style={styles.buttonText}>Buscar partida</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Código de sala (ej. 1234)"
          value={codeInput}
          onChangeText={setCodeInput}
          keyboardType="number-pad"
          maxLength={4}
        />
        <TouchableOpacity style={[styles.button, styles.primary]} onPress={joinRoom}>
          <Text style={styles.buttonText}>Unirse a sala</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onExit}>
          <Text style={styles.back}>Volver al menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'waiting') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sala {code}</Text>
        <Text style={styles.waiting}>Esperando a otro jugador...</Text>
        <TouchableOpacity onPress={onExit}>
          <Text style={styles.back}>Cancelar y volver al menú</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const whoseTurn = state ? state.players[state.turn] : '';
  const labels = ['Izquierdo', 'Derecho'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala {code}</Text>
      <Text style={styles.player}>
        {state ? state.players.join(' vs ') : ''} | {isMyTurn ? 'TU TURNO' : `Turno de ${whoseTurn}`}
      </Text>

      {state && state.revealed && (
        <View style={styles.clueCard}>
          <Text style={styles.clueLabel}>Pista</Text>
          <Text style={styles.clueText}>
            Los minerales {COLOR_ES[state.revealed.color]} pesan {state.revealed.weight} g
          </Text>
        </View>
      )}

      <Scale
        scale={state ? state.scale : [[], []]}
        leftWeight={state ? state.leftWeight : 0}
        rightWeight={state ? state.rightWeight : 0}
        onZoneChange={(which, rect) => setDropZones(prev => ({ ...prev, [which]: rect }))}
      />

      <Text style={[styles.status, balanced ? styles.statusOk : null]}>
        {balanced
          ? 'La balanza está equilibrada'
          : state
            ? `${labels[0]} ${state.leftWeight} g — ${labels[1]} ${state.rightWeight} g`
            : ''}
      </Text>

      <View style={styles.tray}>
        {COLORS.map(color => (
          <MineralCube
            key={color}
            color={color}
            count={state ? state.remaining[color] : 0}
            dropZones={dropZones}
            onPlace={handleDrop}
            canPlace={isMyTurn}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.guessButton, !(balanced && isMyTurn) && styles.guessDisabled]}
        disabled={!(balanced && isMyTurn)}
        onPress={() => setGuessVisible(true)}
      >
        <Text style={styles.guessButtonText}>Adivinar pesos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onExit}>
        <Text style={styles.back}>Salir de la partida</Text>
      </TouchableOpacity>

      <GuessColorModal
        visible={guessVisible}
        onClose={() => setGuessVisible(false)}
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
    textAlign: 'center',
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
  waiting: {
    fontSize: 18,
    marginVertical: 24,
    color: '#555',
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
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#2196F3',
  },
  secondary: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: '80%',
    height: 44,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  guessButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 4,
  },
  guessDisabled: {
    backgroundColor: '#ccc',
  },
  guessButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  back: {
    color: '#1565C0',
    marginTop: 16,
    fontSize: 14,
  },
});

export default OnlineGame;
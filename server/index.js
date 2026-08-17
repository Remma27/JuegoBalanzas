const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const {
  COLORS,
  COLOR_ES,
  cap,
  createRemaining,
  generateMineralWeights,
  isBalanced,
  sideWeight,
  checkGuess,
} = require('../src/game/rules.js');
const Result = require('./models/Result');

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/juegobalanzas';

const httpServer = http.createServer((req, res) => {
  if (req.url === '/ranking' && req.method === 'GET') {
    Result.find()
      .sort({ endedAt: -1 })
      .limit(20)
      .then(results => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      })
      .catch(() => {
        res.writeHead(500);
        res.end('{"error":"db"}');
      });
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, { cors: { origin: '*' } });

const rooms = new Map();
const queue = [];

function roomState(room) {
  const leftWeight = sideWeight(room.scale[0], room.names, room.weights);
  const rightWeight = sideWeight(room.scale[1], room.names, room.weights);
  return {
    code: room.code,
    mode: room.mode,
    players: room.players.map(p => p.name),
    remaining: room.remaining,
    scale: room.scale,
    names: room.names,
    leftWeight,
    rightWeight,
    revealed: room.revealed,
    turn: room.turn,
    phase: room.phase,
  };
}

function pickRevealed(weights, names) {
  const index = Math.floor(Math.random() * weights.length);
  return { color: names[index].split(' ')[0].toLowerCase(), weight: weights[index] };
}

function broadcast(room, event, data) {
  room.players.forEach(p => io.to(p.id).emit(event, data));
}

function newCode() {
  let code;
  do {
    code = String(Math.floor(1000 + Math.random() * 9000));
  } while (rooms.has(code));
  return code;
}

function createRoom(socket, name) {
  const code = newCode();
  const room = {
    code,
    mode: 'multi',
    players: [{ id: socket.id, name }],
    remaining: createRemaining(),
    scale: [[], []],
    names: [],
    weights: [],
    turn: 0,
    phase: 'playing',
  };
  generateMineralWeights(room.remaining).then(({ weights, names }) => {
    room.weights = weights;
    room.names = names;
    room.revealed = pickRevealed(weights, names);
    rooms.set(code, room);
    socket.join(code);
    socket.emit('roomJoined', { ...roomState(room), isHost: true });
  });
  return code;
}

function startMatchmaking(socket, name) {
  queue.push({ id: socket.id, name });
  if (queue.length >= 2) {
    const a = queue.shift();
    const b = queue.shift();
    if (!io.sockets.sockets.get(a.id)) {
      queue.push(b);
      return;
    }
    if (!io.sockets.sockets.get(b.id)) {
      queue.push(a);
      return;
    }
    const code = newCode();
    const room = {
      code,
      mode: 'multi',
      players: [
        { id: a.id, name: a.name },
        { id: b.id, name: b.name },
      ],
      remaining: createRemaining(),
      scale: [[], []],
      names: [],
      weights: [],
      turn: 0,
      phase: 'playing',
    };
    generateMineralWeights(room.remaining).then(({ weights, names }) => {
      room.weights = weights;
      room.names = names;
      room.revealed = pickRevealed(weights, names);
      rooms.set(code, room);
      [a, b].forEach(p => {
        io.sockets.sockets.get(p.id).join(code);
        io.to(p.id).emit('roomJoined', { ...roomState(room), isHost: p.id === a.id });
      });
    });
  }
}

io.on('connection', socket => {
  socket.on('createRoom', ({ name }) => createRoom(socket, name));

  socket.on('joinRoom', ({ code, name }) => {
    const room = rooms.get(code);
    if (!room) {
      socket.emit('error', { msg: 'La sala no existe.' });
      return;
    }
    if (room.players.length >= 2) {
      socket.emit('error', { msg: 'La sala ya está llena.' });
      return;
    }
    room.players.push({ id: socket.id, name });
    socket.join(code);
    io.to(room.players[0].id).emit('roomJoined', { ...roomState(room), isHost: true });
    socket.emit('roomJoined', { ...roomState(room), isHost: false });
  });

  socket.on('matchmaking', ({ name }) => startMatchmaking(socket, name));

  socket.on('placeMineral', ({ code, color, side }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    if (room.players[room.turn].id !== socket.id) {
      socket.emit('error', { msg: 'No es tu turno.' });
      return;
    }
    if (!COLORS.includes(color) || (side !== 'l' && side !== 'r')) return;
    if (room.remaining[color] <= 0) {
      socket.emit('error', { msg: `No quedan minerales de color ${COLOR_ES[color]}.` });
      return;
    }
    const remainingBefore = room.remaining[color];
    room.remaining[color]--;
    const mineralName = `${cap(color)} ${remainingBefore}`;
    room.scale[side === 'l' ? 0 : 1].push(mineralName);
    room.turn = (room.turn + 1) % room.players.length;
    broadcast(room, 'state', roomState(room));
  });

  socket.on('guess', async ({ code, guesses }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    if (!isBalanced(room.scale, room.names, room.weights)) {
      socket.emit('error', { msg: 'La balanza no está equilibrada.' });
      return;
    }
    const { allCorrect, results } = checkGuess(guesses, room.names, room.weights);
    room.phase = 'ended';
    const winner = room.players.find(p => p.id === socket.id);

    try {
      await Result.create({
        roomCode: room.code,
        mode: 'multi',
        players: [
          { name: winner ? winner.name : '?', won: allCorrect, guesses },
          ...room.players
            .filter(p => p.id !== socket.id)
            .map(p => ({ name: p.name, won: false, guesses: {} })),
        ],
        balanced: allCorrect,
      });
    } catch (err) {
      console.error('Error guardando resultado:', err.message);
    }

    broadcast(room, 'guessResult', { guesses, allCorrect, results, by: winner.name });
    broadcast(room, 'state', roomState(room));
    rooms.delete(room.code);
    room.players.forEach(p => io.to(p.id).emit('gameOver'));
  });

  socket.on('leaveRoom', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;
    room.players = room.players.filter(p => p.id !== socket.id);
    if (room.players.length === 0) {
      rooms.delete(code);
    }
  });

  socket.on('disconnect', () => {
    queue.splice(queue.findIndex(q => q.id === socket.id), 1);
    rooms.forEach((room, code) => {
      const wasInRoom = room.players.some(p => p.id === socket.id);
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        rooms.delete(code);
      } else if (wasInRoom) {
        broadcast(room, 'state', roomState(room));
        io.to(room.players[0].id).emit('opponentLeft');
      }
    });
  });
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Servidor listo en http://localhost:${PORT} (MongoDB conectado)`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });
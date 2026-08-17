const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    roomCode: { type: String, default: null },
    mode: { type: String, enum: ['single', 'multi'], required: true },
    players: [
      {
        name: { type: String, required: true },
        won: { type: Boolean, default: false },
        guesses: { type: Object, default: {} },
      },
    ],
    balanced: { type: Boolean, default: false },
    endedAt: { type: Date, default: Date.now },
  },
  { collection: 'results' }
);

resultSchema.index({ 'players.name': 1, endedAt: -1 });

module.exports = mongoose.model('Result', resultSchema);
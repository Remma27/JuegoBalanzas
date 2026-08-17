const COLORS = ['red', 'yellow', 'green', 'blue', 'violet'];
const COLOR_ES = {
  red: 'rojo',
  yellow: 'amarillo',
  green: 'verde',
  blue: 'azul',
  violet: 'violeta',
};
const MAX_WEIGHT = 30;

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function createRemaining() {
  return { red: 2, yellow: 2, green: 2, blue: 2, violet: 2 };
}

function generateMineralWeights(remaining) {
  return new Promise((resolve, reject) => {
    const weights = [];
    const names = [];
    COLORS.forEach(color => {
      const count = remaining[color];
      if (typeof count === 'number' && count > 0) {
        const weight = 1 + Math.floor(Math.random() * MAX_WEIGHT);
        for (let i = 1; i <= count; i++) {
          names.push(`${cap(color)} ${i}`);
          weights.push(weight);
        }
      }
    });
    if (weights.length > 0 && names.length > 0) {
      resolve({ weights, names });
    } else {
      reject(new Error('Error generando datos'));
    }
  });
}

function mineralWeight(name, names, weights) {
  const index = names.indexOf(name);
  return index !== -1 ? weights[index] : 0;
}

function sideWeight(side, names, weights) {
  return side.reduce((total, name) => total + mineralWeight(name, names, weights), 0);
}

function isBalanced(scale, names, weights) {
  return (
    Math.abs(sideWeight(scale[0], names, weights) - sideWeight(scale[1], names, weights)) <
    0.001
  );
}

function checkGuess(guessed, names, weights) {
  const weightMap = {};
  names.forEach((name, index) => {
    const color = name.split(' ')[0].toLowerCase();
    weightMap[color] = weights[index];
  });

  const results = [];
  let allCorrect = true;

  COLORS.forEach(color => {
    const guessedWeight = guessed[color];
    const correctWeight = weightMap[color];

    if (correctWeight === undefined) {
      results.push({ color, ok: false, guessedWeight, msg: 'peso correcto no encontrado' });
      allCorrect = false;
    } else if (parseInt(guessedWeight, 10) !== correctWeight) {
      results.push({ color, ok: false, guessedWeight, correctWeight });
      allCorrect = false;
    } else {
      results.push({ color, ok: true, guessedWeight, correctWeight });
    }
  });

  return { allCorrect, results };
}

module.exports = {
  COLORS,
  COLOR_ES,
  MAX_WEIGHT,
  cap,
  createRemaining,
  generateMineralWeights,
  mineralWeight,
  sideWeight,
  isBalanced,
  checkGuess,
};
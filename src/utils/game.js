// src/utils/game.js

/**
 * Generates a full, shuffled 81-card deck using a seeded RNG.
 * @param {function} rng - A seeded random number generator.
 */
export function generateDeck(rng) {
  const deck = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          deck.push(`${i}${j}${k}${l}`);
        }
      }
    }
  }
  // Fisher-Yates shuffle using the provided RNG
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Checks if three cards form a valid set.
 * @param {string} a Card string
 * @param {string} b Card string
 * @param {string} c Card string
 * @returns {boolean}
 */
export function checkSet(a, b, c) {
  for (let i = 0; i < 4; i++) {
    if ((a.charCodeAt(i) + b.charCodeAt(i) + c.charCodeAt(i)) % 3 !== 0)
      return false;
  }
  return true;
}

/** Returns the unique card c such that {a, b, c} form a set. */
function conjugateCard(a, b) {
  const zeroCode = "0".charCodeAt(0);
  let c = "";
  for (let i = 0; i < 4; i++) {
    const sum = a.charCodeAt(i) - zeroCode + b.charCodeAt(i) - zeroCode;
    const lastNum = (3 - (sum % 3)) % 3;
    c += String.fromCharCode(zeroCode + lastNum);
  }
  return c;
}

/**
 * Counts the number of sets within a given array of cards.
 * @param {string[]} cards Array of card strings.
 * @returns {number} The total number of sets found.
 */
function countSets(cards) {
  let count = 0;
  const cardSet = new Set(cards);
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const thirdCard = conjugateCard(cards[i], cards[j]);
      // Ensure the third card exists and we haven't counted this set before.
      if (cardSet.has(thirdCard) && cards.indexOf(thirdCard) > j) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Generates a board of 12 cards that contains exactly 6 sets.
 * This can be computationally intensive, so it has a limit on attempts.
 * @param {function} rng - A seeded random number generator.
 * @returns {{board: string[], sets: string[][]}}
 */
export function generateBoard(rng) {
  const TARGET_SET_COUNT = 6;
  let attempts = 0;
  const MAX_ATTEMPTS = 5000; // Failsafe to prevent infinite loops

  while (attempts < MAX_ATTEMPTS) {
    const deck = generateDeck(rng);
    const board = deck.slice(0, 12);
    const setCount = countSets(board);

    if (setCount === TARGET_SET_COUNT) {
      const sets = [];
      const cardSet = new Set(board);
      for (let i = 0; i < board.length; i++) {
        for (let j = i + 1; j < board.length; j++) {
          const thirdCard = conjugateCard(board[i], board[j]);
          if (cardSet.has(thirdCard) && board.indexOf(thirdCard) > j) {
            sets.push([board[i], board[j], thirdCard].sort());
          }
        }
      }
      // Sort sets to ensure consistent order for comparison
      const sortedSets = sets.map(s => s.join('|')).sort();
      return { board, sets: sortedSets.map(s => s.split('|')) };
    }
    attempts++;
  }

  console.warn(
    `Could not generate a board with exactly ${TARGET_SET_COUNT} sets after ${MAX_ATTEMPTS} attempts. Using a fallback board.`
  );
  // Fallback to a known good board if generation fails
  const fallbackBoard = {
    board: ["0000", "0011", "0022", "0101", "0112", "0120", "0202", "0210", "0221", "1002", "1010", "1021"],
    sets: [
        ["0000", "0112", "0221"],
        ["0000", "0120", "0210"],
        ["0011", "0101", "0221"],
        ["0011", "0120", "0202"],
        ["0022", "0101", "0210"],
        ["0022", "0112", "0202"],
    ]
  };
  return fallbackBoard;
}

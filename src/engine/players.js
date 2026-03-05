let players = [];
let history = [];
let current = null;

export function setPlayers(names) {
  players = names || [];
  history = [];
  current = null;
}

export function hasPlayers() {
  return players.length > 0;
}

export function getNextPlayer() {
  if (players.length === 0) return null;
  if (players.length === 1) {
    current = players[0];
    return current;
  }

  let candidate;
  let attempts = 0;
  do {
    candidate = players[Math.floor(Math.random() * players.length)];
    attempts++;
    // Prevent 3x in a row: if last 2 are the same as candidate, re-roll
    if (
      history.length >= 2 &&
      history[history.length - 1] === candidate &&
      history[history.length - 2] === candidate
    ) {
      continue;
    }
    break;
  } while (attempts < 20);

  history.push(candidate);
  if (history.length > 10) history.shift();
  current = candidate;
  return current;
}

export function getCurrentPlayer() {
  return current;
}

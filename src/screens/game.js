import { hasPlayers, getNextPlayer, getCurrentPlayer } from '../engine/players.js';

let currentAssignment = '';
let previousAssignment = '';

function pickAssignment(assignments) {
  if (assignments.length <= 1) return assignments[0] || '';

  let next;
  let attempts = 0;
  do {
    next = assignments[Math.floor(Math.random() * assignments.length)];
    attempts++;
  } while (next === previousAssignment && attempts < 20);

  previousAssignment = next;
  currentAssignment = next;
  return next;
}

export function render(container, { players, assignments, onExplode }) {
  currentAssignment = pickAssignment(assignments);
  const playerName = hasPlayers() ? getNextPlayer() : null;

  container.innerHTML = `
    <div class="game-container">
      <div>
        ${playerName ? `<p class="player-label">Geef aan: <span class="player-name">${escapeHtml(playerName)}</span></p>` : ''}
      </div>
      <p class="assignment-text" id="assignment-text">${escapeHtml(currentAssignment)}</p>
      <button class="btn btn-primary" id="klaar-btn">Klaar!</button>
    </div>
  `;

  document.getElementById('klaar-btn').addEventListener('click', () => {
    const newAssignment = pickAssignment(assignments);
    const newPlayer = hasPlayers() ? getNextPlayer() : null;

    document.getElementById('assignment-text').textContent = newAssignment;

    const playerLabel = container.querySelector('.player-label');
    if (playerLabel && newPlayer) {
      playerLabel.innerHTML = `Geef aan: <span class="player-name">${escapeHtml(newPlayer)}</span>`;
    }
  });

  // Store callback for explosion
  window.__hotNuvotato_onExplode = () => {
    onExplode({
      player: hasPlayers() ? getCurrentPlayer() : null,
      assignment: currentAssignment,
    });
  };
}

export function triggerExplode() {
  if (window.__hotNuvotato_onExplode) {
    window.__hotNuvotato_onExplode();
    window.__hotNuvotato_onExplode = null;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

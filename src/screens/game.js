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

export function render(container, { players, assignments, onExplode, onBack }) {
  currentAssignment = pickAssignment(assignments);
  const playerName = hasPlayers() ? getNextPlayer() : null;

  container.innerHTML = `
    <button class="btn-back" id="back-btn">&times;</button>
    <div class="game-container">
      <div>
        ${playerName ? `<p class="player-label">Aan de beurt: <span class="player-name">${escapeHtml(playerName)}</span></p>` : ''}
      </div>
      <p class="assignment-text" id="assignment-text">${escapeHtml(currentAssignment)}</p>
      <button class="btn btn-primary btn-hold" id="klaar-btn">
        <span class="btn-hold-fill" id="klaar-fill"></span>
        <span class="btn-hold-text">Klaar!</span>
      </button>
    </div>
  `;

  const btn = document.getElementById('klaar-btn');
  const fill = document.getElementById('klaar-fill');
  const HOLD_DURATION = 1000;
  let holdStart = null;
  let holdRaf = null;

  function updateFill() {
    const elapsed = performance.now() - holdStart;
    const progress = Math.min(elapsed / HOLD_DURATION, 1);
    fill.style.width = `${progress * 100}%`;

    if (progress >= 1) {
      holdRaf = null;
      resetHold();
      advance();
      return;
    }
    holdRaf = requestAnimationFrame(updateFill);
  }

  function startHold() {
    holdStart = performance.now();
    fill.style.width = '0%';
    holdRaf = requestAnimationFrame(updateFill);
  }

  function resetHold() {
    if (holdRaf !== null) {
      cancelAnimationFrame(holdRaf);
      holdRaf = null;
    }
    holdStart = null;
    fill.style.width = '0%';
  }

  function advance() {
    const newAssignment = pickAssignment(assignments);
    const newPlayer = hasPlayers() ? getNextPlayer() : null;

    document.getElementById('assignment-text').textContent = newAssignment;

    const playerLabel = container.querySelector('.player-label');
    if (playerLabel && newPlayer) {
      playerLabel.innerHTML = `Aan de beurt: <span class="player-name">${escapeHtml(newPlayer)}</span>`;
    }
  }

  btn.addEventListener('mousedown', startHold);
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); }, { passive: false });
  btn.addEventListener('mouseup', resetHold);
  btn.addEventListener('mouseleave', resetHold);
  btn.addEventListener('touchend', resetHold);
  btn.addEventListener('touchcancel', resetHold);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());

  document.getElementById('back-btn').addEventListener('click', () => {
    if (onBack) onBack();
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

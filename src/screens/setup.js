import { getAssignments, saveAssignments, resetAssignments } from '../data/assignments.js';

export function render(container, onStart) {
  let players = [];
  let assignments = getAssignments();

  container.innerHTML = `
    <img src="/logo.jpg" alt="NuVo '68" class="logo" />
    <h1>Hot NuVotato</h1>
    <p class="subtitle">Doe mee... als je durft!<br>Voer de opdracht uit en geef de telefoon door<br><br><strong>Wie ontploft trekt een bak</strong></p>

    <div class="section">
      <div class="section-header" data-section="players">
        <h2>Spelers (optioneel) <span id="player-count"></span></h2>
        <span class="section-toggle">&#9660;</span>
      </div>
      <div class="section-body" id="players-body">
        <div class="input-row">
          <input type="text" id="player-input" placeholder="Naam..." maxlength="20" />
          <button class="btn btn-secondary btn-small" id="add-player-btn">Toevoegen</button>
        </div>
        <div id="player-list"></div>
      </div>
    </div>

    <div class="section">
      <div class="section-header" data-section="assignments">
        <h2>Opdrachten <span id="assignment-count">(${assignments.length})</span></h2>
        <span class="section-toggle">&#9660;</span>
      </div>
      <div class="section-body" id="assignments-body">
        <div class="input-row">
          <input type="text" id="assignment-input" placeholder="Nieuwe opdracht..." />
          <button class="btn btn-secondary btn-small" id="add-assignment-btn">Toevoegen</button>
        </div>
        <div id="assignment-list"></div>
        <button class="reset-link" id="reset-assignments-btn">Standaard herstellen</button>
      </div>
    </div>

    <div style="flex:1"></div>
    <button class="btn btn-primary" id="start-btn">Start!</button>
    <div style="height:1rem"></div>
  `;

  // Section toggle
  container.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.dataset.section;
      const body = document.getElementById(`${section}-body`);
      body.classList.toggle('open');
      header.querySelector('.section-toggle').textContent =
        body.classList.contains('open') ? '\u25B2' : '\u25BC';
    });
  });

  // Players
  const playerInput = document.getElementById('player-input');
  const addPlayerBtn = document.getElementById('add-player-btn');
  const playerList = document.getElementById('player-list');
  const playerCount = document.getElementById('player-count');

  function renderPlayers() {
    playerCount.textContent = players.length > 0 ? `(${players.length})` : '';
    playerList.innerHTML = players.map((name, i) => `
      <div class="list-item">
        <span>${escapeHtml(name)}</span>
        <button class="btn-remove" data-player-idx="${i}">&times;</button>
      </div>
    `).join('');

    playerList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        players.splice(parseInt(btn.dataset.playerIdx), 1);
        renderPlayers();
      });
    });
  }

  function addPlayer() {
    const name = playerInput.value.trim();
    if (name) {
      players.push(name);
      playerInput.value = '';
      renderPlayers();
    }
  }

  addPlayerBtn.addEventListener('click', addPlayer);
  playerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addPlayer();
  });

  // Assignments
  const assignmentInput = document.getElementById('assignment-input');
  const addAssignmentBtn = document.getElementById('add-assignment-btn');
  const assignmentList = document.getElementById('assignment-list');
  const assignmentCount = document.getElementById('assignment-count');
  const resetBtn = document.getElementById('reset-assignments-btn');

  function renderAssignments() {
    assignmentCount.textContent = `(${assignments.length})`;
    assignmentList.innerHTML = assignments.map((text, i) => `
      <div class="list-item">
        <span>${escapeHtml(text)}</span>
        <button class="btn-remove" data-assign-idx="${i}">&times;</button>
      </div>
    `).join('');

    assignmentList.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        assignments.splice(parseInt(btn.dataset.assignIdx), 1);
        saveAssignments(assignments);
        renderAssignments();
      });
    });
  }

  function addAssignment() {
    const text = assignmentInput.value.trim();
    if (text) {
      assignments.push(text);
      assignmentInput.value = '';
      saveAssignments(assignments);
      renderAssignments();
    }
  }

  addAssignmentBtn.addEventListener('click', addAssignment);
  assignmentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addAssignment();
  });

  resetBtn.addEventListener('click', () => {
    assignments = resetAssignments();
    renderAssignments();
  });

  renderAssignments();

  // Start
  document.getElementById('start-btn').addEventListener('click', () => {
    if (players.length === 1) {
      playerInput.focus();
      const body = document.getElementById('players-body');
      if (!body.classList.contains('open')) {
        body.classList.add('open');
      }
      return;
    }

    if (assignments.length === 0) {
      assignmentInput.focus();
      const body = document.getElementById('assignments-body');
      if (!body.classList.contains('open')) {
        body.classList.add('open');
      }
      return;
    }

    onStart({
      players: players.length >= 2 ? [...players] : [],
      assignments: [...assignments],
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

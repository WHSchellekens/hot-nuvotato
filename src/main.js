import { render as renderSetup } from './screens/setup.js';
import { render as renderGame, triggerExplode } from './screens/game.js';
import { render as renderExplosion } from './screens/explosion.js';
import { setPlayers } from './engine/players.js';
import * as timer from './engine/timer.js';
import * as audio from './engine/audio.js';
import * as effects from './engine/effects.js';

const app = document.getElementById('app');
const canvas = document.getElementById('effects-canvas');

let currentState = null;
let gameConfig = null;

effects.init(canvas);

function clearScreen() {
  app.innerHTML = '';
}

function goToSetup() {
  currentState = 'setup';
  timer.stop();
  audio.stopTicking();
  effects.stop();
  clearScreen();

  renderSetup(app, (config) => {
    gameConfig = config;
    // Initialize audio on first user gesture (iOS unlock)
    audio.init();
    audio.resume();
    goToPlaying();
  });
}

function goToPlaying() {
  currentState = 'playing';
  clearScreen();

  if (gameConfig.players.length > 0) {
    setPlayers(gameConfig.players);
  } else {
    setPlayers([]);
  }

  renderGame(app, {
    players: gameConfig.players,
    assignments: gameConfig.assignments,
    onExplode: (data) => {
      goToExploded(data);
    },
    onBack: () => {
      goToSetup();
    },
  });

  // Start timer, audio, and effects
  timer.start(
    (progress) => {
      // onTick — effects and audio driven by their own loops
    },
    () => {
      // onExplode
      triggerExplode();
    }
  );

  audio.startTicking(() => timer.getProgress());
  effects.start(() => timer.getProgress());
}

function goToExploded({ player, assignment }) {
  currentState = 'exploded';
  timer.stop();
  audio.stopTicking();
  effects.stop();

  // Play explosion effects
  audio.playExplosion();
  effects.playExplosionEffect();

  clearScreen();

  renderExplosion(app, {
    player,
    assignment,
    onRestart: () => {
      goToPlaying();
    },
  });
}

// Start the app
goToSetup();

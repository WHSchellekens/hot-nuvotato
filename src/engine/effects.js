let canvas = null;
let ctxCanvas = null;
let rafId = null;
let getProgressFn = null;
let particles = [];
let flashOverlay = null;
let lastFlashTime = 0;

const POOL_SIZE = 200;

function createParticle(x, y, size, vx, vy, life, color) {
  return { x, y, size, vx, vy, life, maxLife: life, color, active: true };
}

function spawnSmoke() {
  const progress = getProgressFn ? getProgressFn() : 0;
  // Spawn rate: 0 at 0%, up to ~18 at 90%+
  const rate = Math.floor(progress * progress * 20);

  for (let i = 0; i < rate; i++) {
    if (particles.length >= POOL_SIZE) break;

    const x = Math.random() * canvas.width;
    const y = canvas.height + 10;
    const size = 3 + progress * 12 + Math.random() * 5;
    const vx = (Math.random() - 0.5) * 1.5;
    const vy = -(1.5 + Math.random() * 2 + progress * 2);
    const life = 80 + Math.random() * 40;
    const gray = 180 + Math.floor(Math.random() * 75);
    const color = `rgba(${gray},${gray},${gray},`;

    particles.push(createParticle(x, y, size, vx, vy, life, color));
  }
}

function handleFlash() {
  if (!flashOverlay) return;
  const progress = getProgressFn ? getProgressFn() : 0;
  if (progress < 0.7) return;

  const now = performance.now();
  // Flash interval: ~1500ms at 0.7, ~200ms at 1.0
  const intensity = (progress - 0.7) / 0.3;
  const interval = 1500 - intensity * 1300;

  if (now - lastFlashTime > interval) {
    lastFlashTime = now;
    flashOverlay.classList.remove('flash');
    // Force reflow
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add('flash');
  }
}

function updateAndDraw() {
  ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const alpha = (p.life / p.maxLife) * 0.4;
    ctxCanvas.fillStyle = p.color + alpha + ')';
    ctxCanvas.beginPath();
    ctxCanvas.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctxCanvas.fill();
  }
}

function loop() {
  spawnSmoke();
  handleFlash();
  updateAndDraw();
  rafId = requestAnimationFrame(loop);
}

export function init(canvasEl) {
  canvas = canvasEl;
  ctxCanvas = canvas.getContext('2d');
  flashOverlay = document.getElementById('flash-overlay');
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function start(progressFn) {
  stopLoop();
  getProgressFn = progressFn;
  particles = [];
  lastFlashTime = 0;
  rafId = requestAnimationFrame(loop);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function stop() {
  stopLoop();
  particles = [];
  if (ctxCanvas && canvas) {
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (flashOverlay) {
    flashOverlay.classList.remove('flash');
  }
}

export function playExplosionEffect() {
  // Burst of particles from center
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const burstCount = Math.min(60, POOL_SIZE - particles.length);
  for (let i = 0; i < burstCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const size = 5 + Math.random() * 15;
    const life = 40 + Math.random() * 30;

    const isRed = Math.random() > 0.4;
    const color = isRed
      ? `rgba(255,${Math.floor(Math.random() * 100)},0,`
      : `rgba(255,${150 + Math.floor(Math.random() * 105)},0,`;

    particles.push(createParticle(cx, cy, size, vx, vy, life, color));
  }

  // Red flash
  if (flashOverlay) {
    flashOverlay.style.background = '#FF2200';
    flashOverlay.style.opacity = '0.7';
    setTimeout(() => {
      flashOverlay.style.opacity = '0';
      setTimeout(() => {
        flashOverlay.style.background = 'var(--white)';
      }, 300);
    }, 200);
  }

  // Shake effect
  const app = document.getElementById('app');
  if (app) {
    app.style.animation = 'shake 0.5s ease-out';
    setTimeout(() => { app.style.animation = ''; }, 500);
  }

  // Run explosion animation using the tracked RAF loop
  function explodeLoop() {
    updateAndDraw();
    if (particles.length > 0) {
      rafId = requestAnimationFrame(explodeLoop);
    } else {
      rafId = null;
    }
  }
  rafId = requestAnimationFrame(explodeLoop);
}

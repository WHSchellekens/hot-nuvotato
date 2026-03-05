let ctx = null;
let tickTimeout = null;
let ticking = false;
let getProgressFn = null;

export function init() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
}

export function resume() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function playTick() {
  if (!ctx || !ticking) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const progress = getProgressFn ? getProgressFn() : 0;
  const volume = 0.15 + 0.55 * progress;

  osc.frequency.value = 800;
  osc.type = 'square';
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.02);

  // Schedule next tick
  const interval = 500 - 420 * progress; // 500ms -> 80ms
  tickTimeout = setTimeout(playTick, interval);
}

export function startTicking(progressFn) {
  stopTicking();
  getProgressFn = progressFn;
  ticking = true;
  playTick();
}

export function stopTicking() {
  ticking = false;
  if (tickTimeout !== null) {
    clearTimeout(tickTimeout);
    tickTimeout = null;
  }
}

export function playExplosion() {
  if (!ctx) return;

  // White noise burst
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.8, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.5);

  // Low frequency boom
  const boom = ctx.createOscillator();
  const boomGain = ctx.createGain();
  boom.connect(boomGain);
  boomGain.connect(ctx.destination);
  boom.frequency.value = 60;
  boom.type = 'sine';
  boomGain.gain.setValueAtTime(1, ctx.currentTime);
  boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  boom.start();
  boom.stop(ctx.currentTime + 0.5);
}

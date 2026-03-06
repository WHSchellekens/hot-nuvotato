let ctx = null;
let tickTimeout = null;
let ticking = false;
let getProgressFn = null;
let isTock = false;
let explosionBuffer = null;
let quoteBuffer = null;

export function init() {
  if (ctx) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  preloadSounds();
}

export function resume() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

async function preloadSounds() {
  try {
    const [expRes, quoteRes] = await Promise.all([
      fetch('/sounds/explosion.mp3'),
      fetch('/sounds/quote.mp3'),
    ]);
    const [expBuf, quoteBuf] = await Promise.all([
      expRes.arrayBuffer(),
      quoteRes.arrayBuffer(),
    ]);
    explosionBuffer = await ctx.decodeAudioData(expBuf);
    quoteBuffer = await ctx.decodeAudioData(quoteBuf);
  } catch (_) { /* sounds will fall back to procedural */ }
}

function playTick() {
  if (!ctx || !ticking) return;

  const progress = getProgressFn ? getProgressFn() : 0;
  const volume = 0.6 + 0.4 * progress;

  // Tick = higher pitch, Tock = lower pitch
  const freq = isTock ? 600 : 1000;
  const duration = 0.015;
  isTock = !isTock;

  // Main click oscillator
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = 'sine';
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);

  // Filtered noise layer for a more mechanical click
  const bufSize = ctx.sampleRate * duration;
  const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  const noiseGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 5;
  noiseSrc.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  noiseSrc.start(ctx.currentTime);
  noiseSrc.stop(ctx.currentTime + duration);

  // Low thump at higher progress
  if (progress > 0.5) {
    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.frequency.value = 80;
    thump.type = 'sine';
    const thumpVol = (progress - 0.5) * 0.4;
    thumpGain.gain.setValueAtTime(thumpVol, ctx.currentTime);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    thump.start(ctx.currentTime);
    thump.stop(ctx.currentTime + 0.03);
  }

  // Schedule next tick — starts slower, still gets fast at the end
  const interval = 700 - 600 * progress; // 700ms -> 100ms
  tickTimeout = setTimeout(playTick, interval);
}

export function startTicking(progressFn) {
  stopTicking();
  getProgressFn = progressFn;
  ticking = true;
  isTock = false;
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

  // Play explosion sample if loaded
  if (explosionBuffer) {
    const src = ctx.createBufferSource();
    src.buffer = explosionBuffer;
    const gain = ctx.createGain();
    gain.gain.value = 1.1;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  // Play quote layered on top with slight delay
  if (quoteBuffer) {
    const src = ctx.createBufferSource();
    src.buffer = quoteBuffer;
    const gain = ctx.createGain();
    gain.gain.value = 1.1;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime + 0.9);
  }
}

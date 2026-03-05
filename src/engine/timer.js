let startTime = 0;
let duration = 0;
let rafId = null;
let tickCb = null;
let explodeCb = null;

let lastFrameTime = 0;

function loop(now) {
  // Detect long gaps (app backgrounded) — cap elapsed to avoid instant explosion
  if (lastFrameTime > 0 && now - lastFrameTime > 1000) {
    // Shift start time forward to account for the gap, preserving current progress
    const gap = now - lastFrameTime - 16; // subtract one frame
    startTime += gap;
  }
  lastFrameTime = now;

  const elapsed = now - startTime;
  const progress = Math.min(elapsed / duration, 1);

  if (tickCb) tickCb(progress);

  if (progress >= 1) {
    rafId = null;
    if (explodeCb) explodeCb();
    return;
  }

  rafId = requestAnimationFrame(loop);
}

export function start(onTick, onExplode) {
  stop();
  duration = 45000 + Math.random() * 65000; // 45-110 seconds
  startTime = performance.now();
  lastFrameTime = 0;
  tickCb = onTick;
  explodeCb = onExplode;
  rafId = requestAnimationFrame(loop);
}

export function stop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  tickCb = null;
  explodeCb = null;
}

export function getProgress() {
  if (!startTime || !duration) return 0;
  return Math.min((performance.now() - startTime) / duration, 1);
}

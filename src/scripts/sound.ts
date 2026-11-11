/**
 * Tiny synthesised UI sounds (no audio files). Off by default; the choice is
 * remembered per visitor. Never plays without an explicit opt-in.
 */
const KEY = 'va:sound';
let ctx: AudioContext | null = null;
let enabled = false;

try {
  enabled = localStorage.getItem(KEY) === 'on';
} catch {
  /* storage unavailable */
}

export function isSoundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  if (on) blip('confirm');
}

type Kind = 'move' | 'confirm' | 'unlock' | 'back';

const PATTERNS: Record<Kind, [number, number, number][]> = {
  // [frequency Hz, start s, duration s]
  move: [[660, 0, 0.05]],
  confirm: [
    [523, 0, 0.06],
    [784, 0.06, 0.09],
  ],
  back: [
    [494, 0, 0.06],
    [330, 0.06, 0.08],
  ],
  unlock: [
    [523, 0, 0.08],
    [659, 0.08, 0.08],
    [784, 0.16, 0.08],
    [1047, 0.24, 0.18],
  ],
};

export function blip(kind: Kind) {
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    for (const [f, start, dur] of PATTERNS[kind]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.05, now + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    }
  } catch {
    /* audio unsupported */
  }
}

"use client";

const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx || ctx.state === "closed") ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function beep(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playClick() {
  beep(800, 0.06, "square", 0.04);
}

export function playHover() {
  beep(600, 0.03, "sine", 0.02);
}

export function playSuccess() {
  const c = getCtx();
  if (!c) return;
  setTimeout(() => beep(523, 0.12, "sine", 0.06), 0);
  setTimeout(() => beep(659, 0.12, "sine", 0.06), 100);
  setTimeout(() => beep(784, 0.2, "sine", 0.06), 200);
}

export function playError() {
  beep(200, 0.25, "sawtooth", 0.05);
}

export function playNotification() {
  setTimeout(() => beep(880, 0.08, "sine", 0.05), 0);
  setTimeout(() => beep(1100, 0.12, "sine", 0.05), 80);
}

export function playType() {
  beep(1200 + Math.random() * 400, 0.02, "square", 0.015);
}

export function playMissionStart() {
  const c = getCtx();
  if (!c) return;
  setTimeout(() => beep(440, 0.1, "sine", 0.06), 0);
  setTimeout(() => beep(554, 0.1, "sine", 0.06), 100);
  setTimeout(() => beep(659, 0.1, "sine", 0.06), 200);
  setTimeout(() => beep(880, 0.25, "sine", 0.08), 300);
}

export function playMissionComplete() {
  const c = getCtx();
  if (!c) return;
  setTimeout(() => beep(523, 0.15, "sine", 0.07), 0);
  setTimeout(() => beep(659, 0.15, "sine", 0.07), 120);
  setTimeout(() => beep(784, 0.15, "sine", 0.07), 240);
  setTimeout(() => beep(1047, 0.3, "sine", 0.09), 360);
}

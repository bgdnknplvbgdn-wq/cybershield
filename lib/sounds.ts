"use client";

const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx || ctx.state === "closed") ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function softTone(freq: number, duration: number, volume = 0.03) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(volume, c.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playClick() {
  softTone(600, 0.08, 0.02);
}

export function playHover() {
  softTone(500, 0.05, 0.01);
}

export function playSuccess() {
  setTimeout(() => softTone(440, 0.2, 0.025), 0);
  setTimeout(() => softTone(554, 0.2, 0.025), 120);
  setTimeout(() => softTone(659, 0.3, 0.03), 240);
}

export function playError() {
  softTone(180, 0.35, 0.02);
}

export function playNotification() {
  setTimeout(() => softTone(700, 0.12, 0.02), 0);
  setTimeout(() => softTone(880, 0.15, 0.02), 100);
}

export function playType() {
  softTone(800 + Math.random() * 200, 0.03, 0.008);
}

export function playMissionStart() {
  setTimeout(() => softTone(392, 0.15, 0.025), 0);
  setTimeout(() => softTone(494, 0.15, 0.025), 130);
  setTimeout(() => softTone(587, 0.15, 0.025), 260);
  setTimeout(() => softTone(784, 0.3, 0.03), 390);
}

export function playMissionComplete() {
  setTimeout(() => softTone(440, 0.2, 0.025), 0);
  setTimeout(() => softTone(554, 0.2, 0.025), 150);
  setTimeout(() => softTone(659, 0.2, 0.025), 300);
  setTimeout(() => softTone(880, 0.4, 0.03), 450);
}

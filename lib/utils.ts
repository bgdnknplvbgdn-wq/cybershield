import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateNickname(nickname: string): boolean {
  return /^[a-zA-Zа-яА-Я0-9]{3,20}$/.test(nickname);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

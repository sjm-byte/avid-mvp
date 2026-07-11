import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatToman(rialAmount: number): string {
  const toman = Math.round(rialAmount / 10);
  return `${formatPersianNumber(toman)} تومان`;
}

export function formatPercent(value: number): string {
  return `${formatPersianNumber(Math.round(value * 100))}٪`;
}

export function formatDurationDays(days: number | null): string {
  if (!days) return "—";
  if (days < 30) return `${formatPersianNumber(days)} روز`;
  const months = Math.round(days / 30);
  return `حدود ${formatPersianNumber(months)} ماه`;
}

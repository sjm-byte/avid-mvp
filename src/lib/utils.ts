import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

/** Persian digits only — no thousand separators (safe for dates/ids). */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

/**
 * Jalali display: سال/ماه/روز (e.g. ۱۴۰۴/۱۱/۵).
 * Source is expected as YYYY/MM/DD or YYYY-MM-DD.
 */
export function formatJalaliDateDisplay(startDate: string): string {
  const [y, m, d] = startDate.split(/[/-]/);
  if (!y || !m || !d) return toPersianDigits(startDate);
  const month = String(Number(m));
  const day = String(Number(d));
  return toPersianDigits(`${y}/${month}/${day}`);
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

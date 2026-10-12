/** Jalali (Solar Hijri) → Gregorian conversion for the English site. */
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let y = jy + 1595;
  let days =
    -355668 +
    365 * y +
    Math.floor(y / 33) * 8 +
    Math.floor(((y % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    days -= 1;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days += 1;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 12 && gd > monthDays[gm]!) {
    gd -= monthDays[gm]!;
    gm += 1;
  }
  return [gy, gm + 1, gd];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "1405/02/12" → "2 May 2026". Returns "—" for empty input. */
export function formatJalaliAsGregorian(jalali: string | null | undefined): string {
  if (!jalali) return "—";
  const [y, m, d] = jalali.split(/[/-]/).map(Number);
  if (!y || !m || !d) return jalali;
  const [gy, gm, gd] = jalaliToGregorian(y, m, d);
  return `${gd} ${MONTHS[gm - 1]} ${gy}`;
}

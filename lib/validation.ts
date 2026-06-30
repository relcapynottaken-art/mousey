// Pure, dependency-free card-FORMAT validators for the local mock checkout.
// These only check shape (Luhn / expiry / CVC); they never contact a payment
// processor. Extracted from the route so they can be unit-tested.

export function luhnValid(num: string): boolean {
  const digits = num.replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function expiryValid(exp: string, now: Date = new Date()): boolean {
  const m = exp.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  // Month-level comparison in UTC so the result is deterministic regardless of
  // the server's timezone (a card is valid through the end of its expiry month).
  const currentMonth = now.getUTCMonth() + 1;
  const currentYear = now.getUTCFullYear();
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

export function cvcValid(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc.trim());
}

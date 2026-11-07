const MAX_AMOUNT = 1_000_000_000;
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_CATEGORY_NAME_LENGTH = 50;

// Mirrors the backend rules: above 0, at most 2 decimals, up to 1,000,000,000.
export function parseAmountInput(text: string): number | null {
  const trimmed = text.trim();
  if (!AMOUNT_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0 || value > MAX_AMOUNT) return null;
  return value;
}

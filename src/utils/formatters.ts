export function formatCurrency(value?: number | null): string {
  const safeValue = Number(value ?? 0);
  if (Number.isNaN(safeValue)) return '₹0';

  if (safeValue >= 100_000) {
    return `₹${(safeValue / 100_000).toFixed(1)}L`;
  }
  if (safeValue >= 1_000) {
    return `₹${(safeValue / 1_000).toFixed(1)}K`;
  }
  return `₹${safeValue.toFixed(0)}`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Exact rupee amount with Indian digit grouping (₹1,23,456.50). Unlike formatCurrency, never
// abbreviates, because an expense must show its exact value.
export function formatRupees(value?: number | null): string {
  const safeValue = Number(value ?? 0);
  if (Number.isNaN(safeValue)) return '₹0';
  const isWhole = Number.isInteger(safeValue);
  const formatted = Math.abs(safeValue).toLocaleString('en-IN', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return safeValue < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

// Shown in place of a value the backend has not synced yet (null). Never render those as 0.
export const EMPTY_VALUE = '—';

// Whole rupees with Indian digit grouping (₹2,48,000), for report figures.
export function formatRupeesWhole(value: number | null): string {
  if (value === null || Number.isNaN(value)) return EMPTY_VALUE;
  const formatted = Math.abs(Math.round(value)).toLocaleString('en-IN');
  return value < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

export function formatCount(value: number | null): string {
  if (value === null || Number.isNaN(value)) return EMPTY_VALUE;
  return value.toLocaleString('en-IN');
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

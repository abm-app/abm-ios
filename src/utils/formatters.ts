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

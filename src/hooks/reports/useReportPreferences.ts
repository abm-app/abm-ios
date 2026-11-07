import { useCallback, useSyncExternalStore } from 'react';

import type { AuditProperty } from '@/types/audit';
import type { ReportType } from '@/types/reports';

interface ReportPreferences {
  type: ReportType;
  // Null until the user picks one; the default then comes from their account.
  property: AuditProperty | null;
}

// Remembered while the app is open only: a module-level value, not persisted and not a store.
let preferences: ReportPreferences = { type: 'daily', property: null };
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ReportPreferences {
  return preferences;
}

function update(next: Partial<ReportPreferences>) {
  preferences = { ...preferences, ...next };
  listeners.forEach(listener => listener());
}

export function useReportPreferences() {
  const current = useSyncExternalStore(subscribe, getSnapshot);
  const setType = useCallback((type: ReportType) => update({ type }), []);
  const setProperty = useCallback((property: AuditProperty) => update({ property }), []);
  return { type: current.type, property: current.property, setType, setProperty };
}

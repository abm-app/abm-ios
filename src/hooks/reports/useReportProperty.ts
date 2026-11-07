import { useAuthStore } from '@/store/authStore';
import type { AuditProperty } from '@/types/audit';
import { useReportPreferences } from './useReportPreferences';

const DEFAULT_PROPERTY: AuditProperty = 'express';

// A user scoped to one property is locked to it (no toggle); everyone else picks one and
// defaults to Express.
export function useReportProperty() {
  const userProperty = useAuthStore(state => state.user?.property);
  const preferences = useReportPreferences();

  const scoped: AuditProperty | null =
    userProperty === 'express' || userProperty === 'international' ? userProperty : null;

  return {
    property: scoped ?? preferences.property ?? DEFAULT_PROPERTY,
    setProperty: preferences.setProperty,
    isScoped: scoped !== null,
  };
}

import { useState, useMemo, useEffect } from 'react';
import { LayoutAnimation } from 'react-native';
import { useAuditEvents } from './useAuditEvents';
import type { AuditFilters } from './useAuditEvents';
import type { AuditProperty } from '@/types/audit';
import { groupEventsByDay } from '@/utils/auditGrouping';
import type { AuditListRow } from '@/utils/auditGrouping';

export interface PropertySection {
  propertyKey: AuditProperty;
  propertyName: string;
  total: number;
  expanded: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  data: AuditListRow[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

interface UseAuditSectionsOptions {
  // When set, both property sections are force-expanded — used when deep-linking to a
  // specific event whose property isn't known up front (see AuditTrailScreen). Keyed on
  // the event ID itself, not just a boolean: if this hook's owner stays mounted and
  // receives a *different* target (e.g. a second audit_event notification tapped while
  // already viewing the result of the first — React Navigation reuses the existing screen
  // instance for a `navigate()` to the already-current route), the ID changing is what
  // triggers re-expanding, since a boolean would already be `true` and never re-fire.
  highlightEventId?: string;
}

export function useAuditSections(
  activeFilters: AuditFilters = {},
  { highlightEventId }: UseAuditSectionsOptions = {},
) {
  const [expandedMap, setExpandedMap] = useState<Record<AuditProperty, boolean>>({
    express: true,
    international: Boolean(highlightEventId),
  });

  useEffect(() => {
    if (highlightEventId) {
      setExpandedMap({ express: true, international: true });
    }
    // Intentionally does nothing when highlightEventId is absent/cleared — manual
    // expand/collapse state from the user shouldn't be reset just because there's no
    // longer a specific target.
  }, [highlightEventId]);

  const expressFilters = useMemo<AuditFilters>(
    () => ({
      ...activeFilters,
      property: ['express'],
    }),
    [activeFilters],
  );

  const internationalFilters = useMemo<AuditFilters>(
    () => ({
      ...activeFilters,
      property: ['international'],
    }),
    [activeFilters],
  );

  const expressQuery = useAuditEvents(expressFilters);
  const internationalQuery = useAuditEvents(internationalFilters);

  const toggleProperty = (propertyKey: AuditProperty) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMap(prev => ({
      ...prev,
      [propertyKey]: !prev[propertyKey],
    }));
  };

  const sections = useMemo<PropertySection[]>(
    () => [
      {
        propertyKey: 'express',
        propertyName: 'ABM Express',
        total: expressQuery.total,
        expanded: expandedMap.express ?? true,
        isLoading: expressQuery.isLoading,
        isError: expressQuery.isError,
        refetch: expressQuery.refetch,
        data: (expandedMap.express ?? true) ? groupEventsByDay(expressQuery.events) : [],
        hasNextPage: expressQuery.hasNextPage,
        isFetchingNextPage: expressQuery.isFetchingNextPage,
        fetchNextPage: expressQuery.fetchNextPage,
      },
      {
        propertyKey: 'international',
        propertyName: 'ABM International',
        total: internationalQuery.total,
        expanded: expandedMap.international ?? false,
        isLoading: internationalQuery.isLoading,
        isError: internationalQuery.isError,
        refetch: internationalQuery.refetch,
        data:
          (expandedMap.international ?? false) ? groupEventsByDay(internationalQuery.events) : [],
        hasNextPage: internationalQuery.hasNextPage,
        isFetchingNextPage: internationalQuery.isFetchingNextPage,
        fetchNextPage: internationalQuery.fetchNextPage,
      },
    ],
    [expandedMap, expressQuery, internationalQuery],
  );

  return {
    sections,
    toggleProperty,
    expandedMap,
  };
}

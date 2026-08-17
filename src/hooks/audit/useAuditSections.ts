import { useState, useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
import { useAuditEvents } from './useAuditEvents';
import type { AuditFilters } from './useAuditEvents';
import type { AuditProperty, AuditEvent } from '@/types/audit';

export interface PropertySection {
  propertyKey: AuditProperty;
  propertyName: string;
  total: number;
  expanded: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  data: AuditEvent[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function useAuditSections(activeFilters: AuditFilters = {}) {
  const [expandedMap, setExpandedMap] = useState<Record<AuditProperty, boolean>>({
    express: true,
    international: false,
  });

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
        data: (expandedMap.express ?? true) ? expressQuery.events : [],
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
        data: (expandedMap.international ?? false) ? internationalQuery.events : [],
        hasNextPage: internationalQuery.hasNextPage,
        isFetchingNextPage: internationalQuery.isFetchingNextPage,
        fetchNextPage: internationalQuery.fetchNextPage,
      },
    ],
    [expandedMap, expressQuery, internationalQuery],
  );

  const handleEndReached = () => {
    if (expandedMap.express && expressQuery.hasNextPage && !expressQuery.isFetchingNextPage) {
      expressQuery.fetchNextPage();
    }
    if (
      expandedMap.international &&
      internationalQuery.hasNextPage &&
      !internationalQuery.isFetchingNextPage
    ) {
      internationalQuery.fetchNextPage();
    }
  };

  return {
    sections,
    toggleProperty,
    handleEndReached,
    expandedMap,
  };
}

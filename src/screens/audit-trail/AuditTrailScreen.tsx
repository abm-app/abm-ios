import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  SectionList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import tokens from '@/theme/tokens';
import { useAuditSections } from '@/hooks/audit/useAuditSections';
import type { PropertySection } from '@/hooks/audit/useAuditSections';
import type { AuditFilters } from '@/hooks/audit/useAuditEvents';
import { AuditCard } from './components/AuditCard';
import { AuditFilterSheet } from './components/AuditFilterSheet';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/shared';
import type { AuditEvent } from '@/types/audit';
import type { RootStackParamList } from '@/navigation/types';

export interface AuditTrailScreenRef {
  openFilters: () => void;
}

// Optional and partial because this component has two call sites: embedded inline inside
// OperationsScreen's tab switcher (no props at all, driven via the ref above), and as a
// standalone root-stack route reached from a notification deep link (full navigation/route
// props, route.params.eventId telling it which event to scroll to and highlight).
type AuditTrailScreenProps = Partial<NativeStackScreenProps<RootStackParamList, 'AuditTrail'>>;

const AuditTrailScreen = forwardRef<AuditTrailScreenRef, AuditTrailScreenProps>(
  ({ navigation, route }, ref) => {
    const highlightEventId = route?.params?.eventId;
    const insets = useSafeAreaInsets();

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState<AuditFilters>({});
    const [hasScrolledToHighlight, setHasScrolledToHighlight] = useState(false);
    const sectionListRef = useRef<SectionList<AuditEvent, PropertySection>>(null);

    useImperativeHandle(ref, () => ({
      openFilters: () => {
        setIsFilterVisible(true);
      },
    }));

    // We don't know which property the linked event belongs to until it's loaded (the
    // notification payload only carries the event ID), so both sections are forced open
    // rather than guessing — otherwise a collapsed section would just look like the event
    // doesn't exist.
    const { sections, toggleProperty, handleEndReached } = useAuditSections(activeFilters, {
      highlightEventId,
    });

    // Resets when the target itself changes — e.g. a second audit_event notification
    // tapped while this same screen instance is already showing the result of the first
    // one (React Navigation reuses the existing screen for a `navigate()` to the
    // already-current route rather than remounting it). Without this, the flag would still
    // be `true` from the previous target and the effect below would never scroll to the
    // new one.
    useEffect(() => {
      setHasScrolledToHighlight(false);
    }, [highlightEventId]);

    // Best-effort: only scrolls to the event if it's among the already-loaded pages. Audit
    // events are sorted most-recent-first and this is specifically for recently-created
    // events (that's what triggers an audit_event push), so in practice it's very likely to
    // already be on the first loaded page. Does not walk further pages hunting for it if not.
    useEffect(() => {
      if (!highlightEventId || hasScrolledToHighlight) {
        return;
      }
      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
        const itemIndex = sections[sectionIndex].data.findIndex(e => e.id === highlightEventId);
        if (itemIndex !== -1) {
          sectionListRef.current?.scrollToLocation({
            sectionIndex,
            itemIndex,
            animated: true,
            viewPosition: 0.3,
          });
          setHasScrolledToHighlight(true);
          break;
        }
      }
    }, [sections, highlightEventId, hasScrolledToHighlight]);

    const handleApplyFilters = (filters: AuditFilters) => {
      setActiveFilters(filters);
      setIsFilterVisible(false);
    };

    const list = (
      <>
        <SectionList<AuditEvent, PropertySection>
          ref={sectionListRef}
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AuditCard event={item} highlighted={item.id === highlightEventId} />
          )}
          onScrollToIndexFailed={() => {
            // Variable-height cards mean SectionList can't always measure ahead of time
            // for a location it hasn't rendered yet. Retry once layout has settled rather
            // than leaving the user unscrolled.
            requestAnimationFrame(() => setHasScrolledToHighlight(false));
          }}
          renderSectionHeader={({ section }) => (
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => toggleProperty(section.propertyKey)}
                style={styles.header}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Toggle ${section.propertyName} accordion`}
              >
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{section.propertyName}</Text>
                  <Text style={styles.count}>({section.total})</Text>
                </View>
                <Feather
                  name={section.expanded ? 'chevron-up' : 'chevron-down'}
                  size={tokens.iconSizes.content}
                  color={tokens.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
          renderSectionFooter={({ section }) => {
            if (!section.expanded) return null;
            if (section.isLoading) {
              return (
                <View style={styles.sectionFooter}>
                  <LoadingSpinner />
                </View>
              );
            }
            if (section.isError) {
              return (
                <View style={styles.sectionFooter}>
                  <ErrorState message="Failed to load events." onRetry={section.refetch} />
                </View>
              );
            }
            if (section.data.length === 0) {
              return (
                <View style={styles.sectionFooter}>
                  <EmptyState
                    icon="file-text"
                    title="No audit events"
                    subtitle="No audit events for this property."
                  />
                </View>
              );
            }
            if (section.isFetchingNextPage) {
              return (
                <View style={styles.sectionFooter}>
                  <ActivityIndicator size="small" color={tokens.colors.primary} />
                </View>
              );
            }
            return <View style={styles.sectionSpacing} />;
          }}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
        />
        <AuditFilterSheet
          visible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          initialFilters={activeFilters}
          onApply={handleApplyFilters}
        />
      </>
    );

    // Rendered standalone (e.g. via a notification deep link) — needs its own header and
    // back button, unlike the embedded usage in OperationsScreen, which already has both
    // from its parent (shared header, segmented tab control).
    if (route) {
      return (
        <View style={[styles.standaloneContainer, { paddingTop: insets.top }]}>
          <View style={styles.standaloneHeader}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="chevron-left" size={24} color={tokens.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.standaloneTitle}>Audit Trail</Text>
          </View>
          <View style={styles.standaloneContent}>{list}</View>
        </View>
      );
    }

    return list;
  },
);

AuditTrailScreen.displayName = 'AuditTrailScreen';

export default AuditTrailScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: tokens.spacing.xl,
  },
  headerContainer: {
    backgroundColor: tokens.colors.background,
    paddingVertical: tokens.spacing.md,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
  count: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
  },
  sectionFooter: {
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
  },
  sectionSpacing: {
    height: tokens.spacing.md,
  },
  standaloneContainer: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  standaloneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xlMd,
    paddingVertical: tokens.spacing.mdLg,
  },
  backButton: {
    paddingRight: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  standaloneTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.headerTitle,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  standaloneContent: {
    flex: 1,
    paddingHorizontal: tokens.spacing.xlMd,
  },
});

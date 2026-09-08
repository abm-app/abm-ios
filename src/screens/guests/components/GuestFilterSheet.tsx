import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { FilterSheet } from '@/components/shared';
import { Button, Chip } from '@/components/ui';

const LAPSED_OPTIONS = [
  { label: '1 month', value: 30 },
  { label: '3 months', value: 90 },
  { label: '6 months', value: 180 },
  { label: '12 months', value: 365 },
];

type FilterSectionKey = 'tier' | 'lapsed' | 'contact';

const SECTION_HINTS: Record<FilterSectionKey, string> = {
  tier: 'Filter guests by their loyalty tier.',
  lapsed: 'Show guests whose last stay was more than the selected period ago.',
  contact: 'Filter guests by whether they have opted in to receive marketing contact.',
};

interface TooltipAnchor {
  section: FilterSectionKey;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GuestFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  initialTier: string;
  initialLapsed: number | null;
  initialDoNotContact: 'true' | 'false' | undefined;
  tierOptions: string[];
  onApply: (filters: {
    tier: string;
    lapsed: number | null;
    doNotContact: 'true' | 'false' | undefined;
  }) => void;
}

interface FilterSectionHeaderProps {
  title: string;
  infoRef: (node: View | null) => void;
  onInfoPress: () => void;
}

function FilterSectionHeader({ title, infoRef, onInfoPress }: FilterSectionHeaderProps) {
  return (
    <View ref={infoRef} style={styles.filterSectionTitleRow}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onInfoPress}
        hitSlop={tokens.spacing.sm}
        style={styles.infoButton}
        accessibilityRole="button"
        accessibilityLabel={`About ${title}`}
      >
        <Feather name="info" size={tokens.iconSizes.content} color={tokens.colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
} // Horizontally centers the caret on the bubble's left padding.
const CARET_LEFT = tokens.spacing.mdLg - tokens.spacing.md / 2;

export default function GuestFilterSheet({
  visible,
  onClose,
  initialTier,
  initialLapsed,
  initialDoNotContact,
  tierOptions,
  onApply,
}: GuestFilterSheetProps) {
  const [draftTier, setDraftTier] = useState(initialTier);
  const [draftLapsed, setDraftLapsed] = useState(initialLapsed);
  const [draftDoNotContact, setDraftDoNotContact] = useState(initialDoNotContact);
  const [tooltip, setTooltip] = useState<TooltipAnchor | null>(null);
  const [prevVisible, setPrevVisible] = useState(visible);
  const sectionRefs = useRef<Record<FilterSectionKey, View | null>>({
    tier: null,
    lapsed: null,
    contact: null,
  });

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setDraftTier(initialTier);
      setDraftLapsed(initialLapsed);
      setDraftDoNotContact(initialDoNotContact);
      setTooltip(null);
    }
  }

  const handleApply = () => {
    onApply({
      tier: draftTier,
      lapsed: draftLapsed,
      doNotContact: draftDoNotContact,
    });
    onClose();
  };

  const handleClearAll = () => {
    setDraftTier('All');
    setDraftLapsed(null);
    setDraftDoNotContact(undefined);
    setTooltip(null);
  };

  const showTooltip = (section: FilterSectionKey) => {
    if (tooltip?.section === section) {
      setTooltip(null);
      return;
    }
    const node = sectionRefs.current[section];
    if (node) {
      node.measureInWindow((x, y, width, height) => {
        setTooltip({ section, x, y, width, height });
      });
    }
  };

  return (
    <FilterSheet
      title="Filters"
      visible={visible}
      onClose={onClose}
      showDragIndicator
      footer={
        <View style={styles.filterFooter}>
          <Button
            label="Clear All"
            variant="secondary"
            style={styles.filterButton}
            onPress={handleClearAll}
          />
          <Button
            label="Apply"
            variant="primary"
            style={styles.filterButton}
            onPress={handleApply}
          />
        </View>
      }
      overlayContent={
        tooltip ? (
          <View style={styles.tooltipLayer}>
            <TouchableWithoutFeedback onPress={() => setTooltip(null)}>
              <View style={styles.tooltipDismiss} />
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.tooltipBubble,
                {
                  top: tooltip.y + tooltip.height + tokens.spacing.s,
                  left: tooltip.x,
                },
              ]}
            >
              <View style={[styles.tooltipCaret, { left: CARET_LEFT }]} />
              <Text style={styles.tooltipText}>{SECTION_HINTS[tooltip.section]}</Text>
            </View>
          </View>
        ) : null
      }
    >
      <View style={styles.filterSection}>
        <FilterSectionHeader
          title="Tier"
          infoRef={node => {
            sectionRefs.current.tier = node;
          }}
          onInfoPress={() => showTooltip('tier')}
        />
        <View style={styles.chipGroup}>
          {tierOptions.map(tier => (
            <Chip
              key={tier}
              label={tier}
              active={draftTier === tier}
              tone={draftTier === tier ? 'primary' : 'default'}
              onPress={() => setDraftTier(tier)}
              style={styles.filterChip}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <FilterSectionHeader
          title="Last Stay"
          infoRef={node => {
            sectionRefs.current.lapsed = node;
          }}
          onInfoPress={() => showTooltip('lapsed')}
        />
        <View style={styles.chipGroup}>
          {LAPSED_OPTIONS.map(option => (
            <Chip
              key={option.value}
              label={option.label}
              active={draftLapsed === option.value}
              tone={draftLapsed === option.value ? 'primary' : 'default'}
              onPress={() => setDraftLapsed(prev => (prev === option.value ? null : option.value))}
              style={styles.filterChip}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <FilterSectionHeader
          title="Contact Preference"
          infoRef={node => {
            sectionRefs.current.contact = node;
          }}
          onInfoPress={() => showTooltip('contact')}
        />
        <View style={styles.chipGroup}>
          <Chip
            label="Opted In"
            active={draftDoNotContact === 'false'}
            tone={draftDoNotContact === 'false' ? 'primary' : 'default'}
            onPress={() => setDraftDoNotContact(prev => (prev === 'false' ? undefined : 'false'))}
            style={styles.filterChip}
          />
          <Chip
            label="Opted Out"
            active={draftDoNotContact === 'true'}
            tone={draftDoNotContact === 'true' ? 'primary' : 'default'}
            onPress={() => setDraftDoNotContact(prev => (prev === 'true' ? undefined : 'true'))}
            style={styles.filterChip}
          />
        </View>
      </View>
    </FilterSheet>
  );
}

const styles = StyleSheet.create({
  filterFooter: {
    flex: 1,
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  filterButton: {
    flex: 1,
  },
  filterSection: {
    marginBottom: tokens.spacing.xl,
  },
  filterSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.md,
  },
  filterSectionTitle: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  infoButton: {
    padding: tokens.spacing.xs,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  filterChip: {
    marginBottom: tokens.spacing.xs,
  },
  tooltipLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  tooltipDismiss: {
    flex: 1,
  },
  tooltipBubble: {
    position: 'absolute',
    width: tokens.tooltip.width,
    backgroundColor: tokens.colors.cardDarkBg,
    borderRadius: tokens.borderRadius.md,
    padding: tokens.spacing.mdLg,
    ...tokens.shadow.modal,
    elevation: 24,
  },
  tooltipCaret: {
    position: 'absolute',
    top: -tokens.spacing.md / 2,
    width: tokens.spacing.md,
    height: tokens.spacing.md,
    backgroundColor: tokens.colors.cardDarkBg,
    transform: [{ rotate: '45deg' }],
  },
  tooltipText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textInverse,
  },
});

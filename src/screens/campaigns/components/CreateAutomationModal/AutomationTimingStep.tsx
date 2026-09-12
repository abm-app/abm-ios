import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tokens from '@/theme/tokens';
import { Input, Chip } from '@/components/ui';
import type { WeekdayCode } from '@/types/campaign';

const WEEKDAYS: { code: WeekdayCode; label: string }[] = [
  { code: 'mon', label: 'Mon' },
  { code: 'tue', label: 'Tue' },
  { code: 'wed', label: 'Wed' },
  { code: 'thu', label: 'Thu' },
  { code: 'fri', label: 'Fri' },
  { code: 'sat', label: 'Sat' },
  { code: 'sun', label: 'Sun' },
];

interface AutomationTimingStepProps {
  showSendWindow: boolean;
  startHour: string;
  endHour: string;
  onChangeStartHour: (val: string) => void;
  onChangeEndHour: (val: string) => void;
  selectedDays: WeekdayCode[];
  onToggleDay: (day: WeekdayCode) => void;
  showPriority: boolean;
  priority: string;
  onChangePriority: (val: string) => void;
}

export default function AutomationTimingStep({
  showSendWindow,
  startHour,
  endHour,
  onChangeStartHour,
  onChangeEndHour,
  selectedDays,
  onToggleDay,
  showPriority,
  priority,
  onChangePriority,
}: AutomationTimingStepProps) {
  return (
    <View>
      {showSendWindow ? (
        <>
          <Text style={styles.sectionLabel}>SEND WINDOW (IST)</Text>
          <Text style={styles.helperText}>
            Times are in IST regardless of the account’s own timezone.
          </Text>
          <View style={styles.hourRow}>
            <Input
              label="Start Hour (0–24)"
              placeholder="e.g. 10"
              value={startHour}
              onChangeText={onChangeStartHour}
              keyboardType="number-pad"
              style={styles.hourInput}
            />
            <Input
              label="End Hour (0–24)"
              placeholder="e.g. 20"
              value={endHour}
              onChangeText={onChangeEndHour}
              keyboardType="number-pad"
              style={styles.hourInput}
            />
          </View>

          <Text style={styles.subLabel}>DAYS OF THE WEEK</Text>
          <View style={styles.chipGroup}>
            {WEEKDAYS.map(day => (
              <Chip
                key={day.code}
                label={day.label}
                active={selectedDays.includes(day.code)}
                tone="primary"
                onPress={() => onToggleDay(day.code)}
              />
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.infoText}>
          Send window doesn’t apply to this trigger — this automation fires immediately, at any time
          of day.
        </Text>
      )}

      {showPriority ? (
        <>
          <Text style={styles.sectionLabel}>PRIORITY</Text>
          <Text style={styles.helperText}>
            Must be a unique number among this account’s automations of the same trigger type. 1 is
            highest priority.
          </Text>
          <Input
            placeholder="e.g. 1"
            value={priority}
            onChangeText={onChangePriority}
            keyboardType="number-pad"
            style={styles.priorityInput}
          />
        </>
      ) : (
        <Text style={styles.infoText}>
          Priority doesn’t affect post-checkout automations — all matching ones send.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '600',
    color: tokens.colors.textHint,
    letterSpacing: 1,
    marginBottom: tokens.spacing.sm,
  },
  helperText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.md,
  },
  hourRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.mdLg,
  },
  hourInput: {
    flex: 1,
    fontFamily: tokens.typography.fontFamily.sub,
  },
  subLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.label,
    fontWeight: '500',
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xl,
  },
  priorityInput: {
    marginBottom: tokens.spacing.mdLg,
    fontFamily: tokens.typography.fontFamily.sub,
  },
  infoText: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xl,
  },
});

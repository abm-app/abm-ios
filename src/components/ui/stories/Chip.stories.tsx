import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import Chip from '../Chip';
import type { ChipProps } from '../Chip';
import tokens from '@/theme/tokens';

const meta: Meta<ChipProps> = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    tone: {
      control: { type: 'select' },
      options: ['default', 'primary', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual stories ──────────────────────────────────────────────────────

export const DefaultInactive: Story = {
  name: 'Default (inactive)',
  args: {
    label: 'Open',
    active: false,
    tone: 'default',
  },
};

export const PrimaryActive: Story = {
  name: 'Primary (active)',
  args: {
    label: 'Open',
    active: true,
    tone: 'primary',
  },
};

export const WarningActive: Story = {
  name: 'Warning (active)',
  args: {
    label: 'Daily',
    active: true,
    tone: 'warning',
  },
};

// ─── Status chips: Open / Recurring / Done with Open active ──────────────────

const statusRowStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.s,
    alignItems: 'center',
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xs,
  },
});

export const StatusOpen: Story = {
  name: 'Status — Open active',
  render: () => (
    <View>
      <Text style={statusRowStyle.label}>Status</Text>
      <View style={statusRowStyle.row}>
        <Chip label="Open" active tone="primary" onPress={() => {}} />
        <Chip label="Recurring" onPress={() => {}} />
        <Chip label="Done" onPress={() => {}} />
      </View>
    </View>
  ),
};

// ─── Recurrence chips: Daily / Weekly / Monthly with Weekly active ────────────

export const RecurrenceWeekly: Story = {
  name: 'Recurrence — Weekly active',
  render: () => (
    <View>
      <Text style={statusRowStyle.label}>Recurrence</Text>
      <View style={statusRowStyle.row}>
        <Chip label="Daily" onPress={() => {}} />
        <Chip label="Weekly" active tone="primary" onPress={() => {}} />
        <Chip label="Monthly" onPress={() => {}} />
      </View>
    </View>
  ),
};

// ─── Recurrence chips: Daily / Weekly / Monthly with Daily warning-active ─────

export const RecurrenceDailyWarning: Story = {
  name: 'Recurrence — Daily warning-active',
  render: () => (
    <View>
      <Text style={statusRowStyle.label}>Recurrence (warning)</Text>
      <View style={statusRowStyle.row}>
        <Chip label="Daily" active tone="warning" onPress={() => {}} />
        <Chip label="Weekly" onPress={() => {}} />
        <Chip label="Monthly" onPress={() => {}} />
      </View>
    </View>
  ),
};

// ─── Interactive controlled example ──────────────────────────────────────────

const interactiveStyle = StyleSheet.create({
  container: {
    gap: tokens.spacing.sm,
  },
  label: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    marginBottom: tokens.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.s,
    alignItems: 'center',
  },
  selected: {
    fontSize: tokens.typography.fontSize.caption,
    color: tokens.colors.textHint,
    marginTop: tokens.spacing.xs,
  },
});

const options = ['Open', 'Recurring', 'Done'] as const;

function InteractiveChipGroup() {
  const [selected, setSelected] = useState<string>('Open');

  return (
    <View style={interactiveStyle.container}>
      <Text style={interactiveStyle.label}>Select status</Text>
      <View style={interactiveStyle.row}>
        {options.map(opt => (
          <Chip
            key={opt}
            label={opt}
            active={selected === opt}
            tone="primary"
            onPress={() => setSelected(opt)}
          />
        ))}
      </View>
      <Text style={interactiveStyle.selected}>Selected: {selected}</Text>
    </View>
  );
}

export const InteractiveControlled: Story = {
  name: 'Interactive (controlled)',
  render: () => <InteractiveChipGroup />,
};

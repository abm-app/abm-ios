import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import Badge from '../Badge';
import type { BadgeProps } from '../Badge';
import tokens from '@/theme/tokens';

const meta: Meta<BadgeProps> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['high', 'medium', 'low', 'category'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual stories ──────────────────────────────────────────────────────

export const High: Story = {
  args: {
    label: 'High',
    variant: 'high',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium',
    variant: 'medium',
  },
};

export const Low: Story = {
  args: {
    label: 'Low',
    variant: 'low',
  },
};

export const Maintenance: Story = {
  args: {
    label: 'Maintenance',
    variant: 'category',
  },
};

export const Orders: Story = {
  args: {
    label: 'Orders',
    variant: 'category',
  },
};

export const Management: Story = {
  args: {
    label: 'Management',
    variant: 'category',
  },
};

// ─── All HTML Badges in one wrapping row ─────────────────────────────────────

const allBadgesStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    alignItems: 'center',
  },
});

export const AllHTMLBadges: Story = {
  name: 'All HTML Badges',
  render: () => (
    <View style={allBadgesStyle.row}>
      <Badge label="High" variant="high" />
      <Badge label="Medium" variant="medium" />
      <Badge label="Low" variant="low" />
      <Badge label="Maintenance" variant="category" />
      <Badge label="Orders" variant="category" />
      <Badge label="Management" variant="category" />
    </View>
  ),
};

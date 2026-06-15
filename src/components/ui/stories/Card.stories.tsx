import { StyleSheet, View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import Card from '../Card';
import type { CardProps } from '../Card';
import tokens from '@/theme/tokens';

const meta: Meta<CardProps> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual stories ──────────────────────────────────────────────────────

export const BaseSurface: Story = {
  name: 'Base Card Surface',
  render: () => (
    <Card padded>
      <Text style={cardContentStyle.title}>Stat Card</Text>
      <Text style={cardContentStyle.body}>
        This is a base card with padding matching the HTML stat card geometry.
      </Text>
    </Card>
  ),
};

export const NoPadding: Story = {
  name: 'No Padding Card',
  render: () => (
    <Card>
      <View style={cardContentStyle.noPaddingInner}>
        <Text style={cardContentStyle.body}>
          This card has no internal padding — content fills the full card area.
        </Text>
      </View>
    </Card>
  ),
};

export const Pressable: Story = {
  name: 'Pressable Card',
  render: () => (
    <Card onPress={() => {}} padded>
      <Text style={cardContentStyle.title}>Pressable Card</Text>
      <Text style={cardContentStyle.body}>
        Tap this card — it wraps content in a TouchableOpacity.
      </Text>
    </Card>
  ),
};

// ─── Card content story styles ───────────────────────────────────────────────

const cardContentStyle = StyleSheet.create({
  title: {
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  body: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
  noPaddingInner: {
    padding: tokens.spacing.lgMd,
  },
});

import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import DesignSystemNavigationPreview from '../DesignSystemNavigationPreview';
import DashboardScoreCard from '../DashboardScoreCard';
import type { DesignSystemNavigationPreviewProps } from '../DesignSystemNavigationPreview';
import tokens from '@/theme/tokens';

const meta: Meta = {
  title: 'Compositions/AllCompositions',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavItems: DesignSystemNavigationPreviewProps['items'] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'tasks', label: 'Tasks', icon: 'check-square' },
  { key: 'reviews', label: 'Reviews', icon: 'star' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];

export const AllCompositions: Story = {
  name: 'All Compositions',
  render: () => (
    <View style={compositionStyle.container}>
      <View style={compositionStyle.section}>
        <DesignSystemNavigationPreview items={defaultNavItems} activeKey="dashboard" />
      </View>
      <View style={compositionStyle.section}>
        <DashboardScoreCard
          score="4.8"
          label="Overall Score"
          miniStats={[
            { value: 25, label: 'Critical' },
            { value: 15, label: 'Open' },
            { value: 50, label: 'Closed' },
          ]}
        />
      </View>
    </View>
  ),
};

const compositionStyle = StyleSheet.create({
  container: {
    gap: tokens.spacing.lgMd,
    padding: tokens.spacing.lgMd,
  },
  section: {
    gap: tokens.spacing.sm,
  },
});

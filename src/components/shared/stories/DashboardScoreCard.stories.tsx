import type { Meta, StoryObj } from '@storybook/react-native';

import DashboardScoreCard from '../DashboardScoreCard';
import type { DashboardScoreCardProps } from '../DashboardScoreCard';

const meta: Meta<DashboardScoreCardProps> = {
  title: 'Compositions/DashboardScoreCard',
  component: DashboardScoreCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OverallScore: Story = {
  name: '4.8 Overall Score',
  args: {
    score: '4.8',
    label: 'Overall Score',
    miniStats: [
      { id: 'critical', value: 25, label: 'Critical' },
      { id: 'open', value: 15, label: 'Open' },
      { id: 'closed', value: 50, label: 'Closed' },
    ],
  },
};

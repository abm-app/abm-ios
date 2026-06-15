import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import DesignSystemNavigationPreview from '../DesignSystemNavigationPreview';
import DashboardScoreCard from '../DashboardScoreCard';
import TaskItem from '../TaskItem';
import QuickInsightsCard from '../QuickInsightsCard';
import CreateTaskModalPreview from '../CreateTaskModalPreview';
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
            { id: 'critical', value: 25, label: 'Critical' },
            { id: 'open', value: 15, label: 'Open' },
            { id: 'closed', value: 50, label: 'Closed' },
          ]}
        />
      </View>
      <View style={compositionStyle.section}>
        <TaskItem
          title="Restock Takeout Station"
          priority="high"
          categories={['Maintenance', 'Orders']}
          dueText="Due Today"
          recurrenceText="Weekly"
          checked={false}
          onToggle={() => {}}
        />
      </View>
      <View style={compositionStyle.section}>
        <QuickInsightsCard
          items={[
            { id: '1', label: '3 tasks overdue', tone: 'danger', percentage: 60 },
            { id: '2', label: 'CSAT score slipping', tone: 'warning', percentage: 42 },
            { id: '3', label: 'Response time up 12%', tone: 'info', percentage: 72 },
            { id: '4', label: '14 reviews unactioned', tone: 'muted', percentage: 28 },
          ]}
        />
      </View>
    </View>
  ),
};

function InteractiveCreateTaskModal() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [recurrence, setRecurrence] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  return (
    <CreateTaskModalPreview
      outlet="Zan Zan Mini Budget, YMI"
      title={title}
      onTitleChange={setTitle}
      selectedPriority={priority}
      onPrioritySelect={setPriority}
      selectedRecurrence={recurrence}
      onRecurrenceSelect={setRecurrence}
      onCancel={() => {}}
      onCreateTask={() => {}}
    />
  );
}

export const CreateTaskModal: StoryObj = {
  name: 'Create Task Modal',
  render: () => (
    <View style={compositionStyle.container}>
      <InteractiveCreateTaskModal />
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

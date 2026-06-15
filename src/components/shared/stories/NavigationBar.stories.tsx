import type { Meta, StoryObj } from '@storybook/react-native';

import DesignSystemNavigationPreview from '../DesignSystemNavigationPreview';
import type { DesignSystemNavigationPreviewProps } from '../DesignSystemNavigationPreview';

const meta: Meta<DesignSystemNavigationPreviewProps> = {
  title: 'Compositions/NavigationBar',
  component: DesignSystemNavigationPreview,
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

export const DashboardActive: Story = {
  name: 'Dashboard Active',
  args: {
    items: defaultNavItems,
    activeKey: 'dashboard',
  },
};

export const TasksActive: Story = {
  name: 'Tasks Active',
  args: {
    items: defaultNavItems,
    activeKey: 'tasks',
  },
};

export const AllNavItems: Story = {
  name: 'All Nav Items',
  args: {
    items: defaultNavItems,
    activeKey: 'dashboard',
  },
};

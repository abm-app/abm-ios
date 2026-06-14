import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import Input from '../Input';
import type { InputProps } from '../Input';
import tokens from '@/theme/tokens';

const meta: Meta<InputProps> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    editable: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── HTML parity stories ─────────────────────────────────────────────────────

export const TaskTitle: Story = {
  name: 'Task Title',
  args: {
    label: 'Task title',
    placeholder: 'e.g. Restock seafood station',
  },
};

export const DueDate: Story = {
  name: 'Due Date',
  args: {
    label: 'Due date',
    value: '2026-06-11',
  },
};

export const Search: Story = {
  name: 'Search',
  args: {
    label: 'Search',
    placeholder: 'Search tasks...',
  },
};

// ─── Behavior coverage stories ───────────────────────────────────────────────

export const WithError: Story = {
  name: 'Error State',
  args: {
    label: 'Task title',
    placeholder: 'Enter a task title',
    error: 'Task title is required',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    label: 'Due date',
    value: '2026-06-11',
    editable: false,
  },
};

export const SecureInput: Story = {
  name: 'Secure Input',
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    secureTextEntry: true,
  },
};

// ─── All HTML Inputs in a column ─────────────────────────────────────────────

const allInputsStyle = StyleSheet.create({
  column: {
    gap: tokens.spacing.md,
    maxWidth: tokens.spacing.xxlMd * 12,
  },
});

export const AllHTMLInputs: Story = {
  name: 'All HTML Inputs',
  render: () => (
    <View style={allInputsStyle.column}>
      <Input label="Task title" placeholder="e.g. Restock seafood station" />
      <Input label="Due date" value="2026-06-11" />
      <Input label="Search" placeholder="Search tasks..." />
    </View>
  ),
};

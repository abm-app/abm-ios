import { StyleSheet, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import tokens from '@/theme/tokens';
import Button from '../Button';
import type { ButtonProps } from '../Button';

const meta: Meta<ButtonProps> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['md', 'sm'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  args: {
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual stories ──────────────────────────────────────────────────────

export const CreateTask: Story = {
  args: {
    label: 'Create Task',
    variant: 'primary',
    size: 'md',
  },
};

export const Edit: Story = {
  args: {
    label: 'Edit',
    variant: 'secondary',
    size: 'md',
  },
};

export const Cancel: Story = {
  args: {
    label: 'Cancel',
    variant: 'ghost',
    size: 'md',
  },
};

export const Delete: Story = {
  args: {
    label: 'Delete',
    variant: 'danger',
    size: 'md',
  },
};

export const NewSmall: Story = {
  name: '+ New (sm)',
  args: {
    label: '+ New',
    variant: 'primary',
    size: 'sm',
  },
};

export const DelegateSmall: Story = {
  name: 'Delegate (sm)',
  args: {
    label: 'Delegate',
    variant: 'secondary',
    size: 'sm',
  },
};

export const Loading: Story = {
  args: {
    label: 'Create Task',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Create Task',
    variant: 'primary',
    disabled: true,
  },
};

// ─── All HTML Buttons in one wrapping row ────────────────────────────────────

const allButtonsStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    alignItems: 'center',
  },
});

export const AllHTMLButtons: Story = {
  name: 'All HTML Buttons',
  render: () => (
    <View style={allButtonsStyle.row}>
      <Button label="Create Task" variant="primary" size="md" onPress={() => {}} />
      <Button label="Edit" variant="secondary" size="md" onPress={() => {}} />
      <Button label="Cancel" variant="ghost" size="md" onPress={() => {}} />
      <Button label="Delete" variant="danger" size="md" onPress={() => {}} />
      <Button label="+ New" variant="primary" size="sm" onPress={() => {}} />
      <Button label="Delegate" variant="secondary" size="sm" onPress={() => {}} />
    </View>
  ),
};

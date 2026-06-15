import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../src/components/ui/stories/**/*.stories.?(ts|tsx|js|jsx)',
    '../src/components/shared/stories/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;

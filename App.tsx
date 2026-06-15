import React from 'react';

import ENV from '@/config/env';
import RootNavigator from '@/navigation/RootNavigator';

let AppEntry: React.ComponentType;

if (ENV.STORYBOOK_ENABLED) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AppEntry = require('./.rnstorybook').default;
} else {
  AppEntry = RootNavigator;
}

export default AppEntry;

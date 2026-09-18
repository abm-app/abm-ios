import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

// Lets code outside the navigation component tree (e.g. notification tap handlers) trigger
// navigation. Pass this as NavigationContainer's `ref` prop in RootNavigator.
// Callers must check `navigationRef.isReady()` before calling `.navigate(...)`.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

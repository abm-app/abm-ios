import { useSafeAreaInsets } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';

// Bottom padding for scrolling content so the last item stops above the floating tab bar,
// which is drawn on top of the screen rather than reserving space for itself.
export function useFloatingTabBarInset(): number {
  const insets = useSafeAreaInsets();
  return (
    Math.max(insets.bottom, tokens.navigation.paddingVertical) +
    tokens.navigation.capsuleHeight +
    tokens.spacing.lgMd
  );
}

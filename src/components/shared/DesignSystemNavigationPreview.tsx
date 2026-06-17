import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import tokens from '@/theme/tokens';

export type NavItemKey = 'dashboard' | 'tasks' | 'reviews' | 'profile';

export interface NavItem {
  key: NavItemKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

export interface DesignSystemNavigationPreviewProps {
  /** Navigation items to render. Each item provides a key, label, and Feather icon name. */
  items: NavItem[];
  /** Key of the currently active tab. The matching item receives the filled black
   * background and inverted icon/text colors. */
  activeKey: NavItemKey;
  /** Additional container styles merged after bar defaults. */
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const inactiveIconColor = tokens.colors.textMuted;

const labelInactiveStyle: TextStyle = {
  color: tokens.colors.textHint,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignSystemNavigationPreview({
  items,
  activeKey,
  style,
}: DesignSystemNavigationPreviewProps) {
  return (
    <View style={[styles.bar, style]}>
      {items.map(item => {
        const isActive = item.key === activeKey;

        return (
          <View key={item.key} style={[styles.item, isActive && styles.itemActive]}>
            <Feather
              name={item.icon}
              size={tokens.iconSizes.navPreview}
              color={isActive ? tokens.colors.background : inactiveIconColor}
            />
            <Text style={[styles.label, isActive ? styles.labelActive : labelInactiveStyle]}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    borderRadius: tokens.navigation.borderRadius,
    paddingVertical: tokens.navigation.paddingVertical,
    paddingHorizontal: tokens.navigation.paddingHorizontal,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  item: {
    alignItems: 'center',
    gap: tokens.navigation.itemGap,
    paddingTop: tokens.navigation.itemPaddingTop,
    paddingBottom: tokens.navigation.itemPaddingBottom,
    paddingHorizontal: tokens.navigation.itemPaddingHorizontal,
    borderRadius: tokens.navigation.itemBorderRadius,
  },
  itemActive: {
    backgroundColor: tokens.colors.primary,
  },
  label: {
    fontSize: tokens.typography.fontSize.navLabel,
    fontWeight: tokens.typography.fontWeight.medium,
    letterSpacing: tokens.typography.letterSpacing.navLabel,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: tokens.colors.background,
  },
});

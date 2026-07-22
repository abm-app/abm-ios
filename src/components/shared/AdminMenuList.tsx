import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminMenuItem {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  route: string;
}

interface AdminMenuListProps {
  items: AdminMenuItem[];
  onNavigate: (route: string) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminMenuList({ items, onNavigate }: AdminMenuListProps) {
  return (
    <View style={styles.menuCard}>
      {items.map((item, index) => (
        <React.Fragment key={item.route}>
          {index > 0 && <View style={styles.menuDivider} />}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.6}
            onPress={() => onNavigate(item.route)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconContainer}>
                <Feather
                  name={item.icon}
                  size={tokens.iconSizes.content}
                  color={tokens.colors.textPrimary}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Feather
              name="chevron-right"
              size={tokens.iconSizes.content}
              color={tokens.colors.textMuted}
            />
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  menuCard: {
    marginTop: tokens.spacing.lgMd,
    marginHorizontal: tokens.spacing.xlMd,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: tokens.borderWidth.thin,
    borderColor: tokens.colors.border,
    ...tokens.shadow.modal,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lgMd,
    paddingVertical: tokens.spacing.lg,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.mdLg,
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: tokens.borderRadius.sm,
    backgroundColor: tokens.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textPrimary,
  },
  menuDivider: {
    height: tokens.borderWidth.hairline,
    backgroundColor: tokens.colors.border,
    marginHorizontal: tokens.spacing.lgMd,
  },
});

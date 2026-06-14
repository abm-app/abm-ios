import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import tokens from '@/theme/tokens';
import Badge from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';

export interface TaskItemProps {
  title: string;
  priority: 'high' | 'medium' | 'low';
  categories: string[];
  dueText: string;
  recurrenceText: string;
  checked: boolean;
  onToggle?: () => void;
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

// ─── Pre-created token-derived style maps ────────────────────────────────────

const priorityVariant: Record<TaskItemProps['priority'], BadgeVariant> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
};

const metaIconColor = tokens.colors.textHint;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TaskItem({
  title,
  priority,
  categories,
  dueText,
  recurrenceText,
  checked,
  onToggle,
  style,
}: TaskItemProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
          style={[styles.checkbox, checked && styles.checkboxChecked]}
        >
          {checked ? (
            <Feather name="check" size={tokens.iconSizes.inline} color={tokens.colors.background} />
          ) : null}
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Badge
          label={priority.charAt(0).toUpperCase() + priority.slice(1)}
          variant={priorityVariant[priority]}
        />
      </View>
      <View style={styles.badges}>
        {categories.map(cat => (
          <Badge key={cat} label={cat} variant="category" />
        ))}
      </View>
      <View style={styles.meta}>
        <Feather name="calendar" size={tokens.iconSizes.taskMeta} color={metaIconColor} />
        <Text style={styles.metaText}>{dueText}</Text>
        <Feather name="repeat" size={tokens.iconSizes.taskMeta} color={metaIconColor} />
        <Text style={styles.metaText}>{recurrenceText}</Text>
      </View>
    </View>
  );
}

// ─── Static base styles ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.background,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
    paddingVertical: tokens.taskCard.paddingVertical,
    paddingHorizontal: tokens.taskCard.paddingHorizontal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.taskCard.headerGap,
    marginBottom: tokens.taskCard.headerMarginBottom,
  },
  checkbox: {
    width: tokens.taskCheckbox.width,
    height: tokens.taskCheckbox.height,
    borderRadius: tokens.taskCheckbox.borderRadius,
    borderWidth: tokens.taskCheckbox.borderWidth,
    borderColor: tokens.colors.borderMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.xxs,
  },
  checkboxChecked: {
    backgroundColor: tokens.colors.primary,
    borderColor: tokens.colors.primary,
  },
  title: {
    flex: 1,
    fontSize: tokens.typography.fontSize.taskTitle,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.taskCard.badgeGap,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.taskCard.metaGap,
    marginTop: tokens.taskCard.metaMarginTop,
  },
  metaText: {
    fontSize: tokens.typography.fontSize.label,
    color: tokens.colors.textHint,
  },
});

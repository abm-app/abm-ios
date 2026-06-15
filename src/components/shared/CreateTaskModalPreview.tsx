import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import tokens from '@/theme/tokens';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Chip from '../ui/Chip';
import Button from '../ui/Button';

export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'daily' | 'weekly' | 'monthly';

export interface CreateTaskModalPreviewProps {
  /** Outlet name displayed in the subtitle (e.g. "Zan Zan Mini Budget, YMI"). */
  outlet: string;
  /** Current value of the task title input field. */
  title: string;
  /** Called when the user types in the title field. Receives the updated text. */
  onTitleChange?: (text: string) => void;
  /** Currently selected priority. The matching badge renders with a visible border. */
  selectedPriority: Priority;
  /** Called when a priority badge is tapped. Receives the selected priority key. */
  onPrioritySelect?: (priority: Priority) => void;
  /** Currently selected recurrence. The matching chip renders in its active tone. */
  selectedRecurrence: Recurrence;
  /** Called when a recurrence chip is tapped. Receives the selected recurrence key. */
  onRecurrenceSelect?: (recurrence: Recurrence) => void;
  /** Called when the Cancel button is pressed. If omitted, the button uses a no-op. */
  onCancel?: () => void;
  /** Called when the Create Task button is pressed. If omitted, the button uses a no-op. */
  onCreateTask?: () => void;
  /** Additional container styles merged after modal card defaults. */
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

// ─── Pre-created token-derived style maps (module-level, computed once) ──────

const priorityVariant: Record<Priority, 'high' | 'medium' | 'low'> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
};

const recurrenceLabel: Record<Recurrence, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const priorityOptions: Priority[] = ['high', 'medium', 'low'];
const recurrenceOptions: Recurrence[] = Object.keys(recurrenceLabel) as Recurrence[];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateTaskModalPreview({
  outlet,
  title,
  onTitleChange,
  selectedPriority,
  onPrioritySelect,
  selectedRecurrence,
  onRecurrenceSelect,
  onCancel,
  onCreateTask,
  style,
}: CreateTaskModalPreviewProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>Create New Task</Text>
      <Text style={styles.subtitle}>Choose outlet: {outlet}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Task title</Text>
        <Input value={title} onChangeText={onTitleChange} placeholder="e.g. Restock seafood" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Priority</Text>
        <View style={styles.badgeRow}>
          {priorityOptions.map(p => (
            <TouchableOpacity key={p} onPress={() => onPrioritySelect?.(p)} activeOpacity={0.7}>
              <Badge
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                variant={priorityVariant[p]}
                style={[styles.interactiveBadge, selectedPriority === p && styles.badgeSelected]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Recurrence</Text>
        <View style={styles.chipRow}>
          {recurrenceOptions.map(r => (
            <Chip
              key={r}
              label={recurrenceLabel[r]}
              active={selectedRecurrence === r}
              tone="primary"
              onPress={() => onRecurrenceSelect?.(r)}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Cancel"
          variant="ghost"
          onPress={onCancel ?? (() => {})}
          style={styles.footerButton}
        />
        <Button
          label="Create Task"
          variant="primary"
          onPress={onCreateTask ?? (() => {})}
          style={styles.footerButtonConfirm}
        />
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
    borderRadius: tokens.modal.borderRadius,
    padding: tokens.modal.padding,
    ...tokens.shadow.modal,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.modalTitle,
    fontWeight: tokens.typography.fontWeight.regular,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.modal.titleMarginBottom,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.chip,
    color: tokens.colors.textMuted,
    marginBottom: tokens.modal.subtitleMarginBottom,
  },
  formGroup: {
    marginBottom: tokens.form.groupBottomMargin,
  },
  formLabel: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.textMuted,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase',
    marginBottom: tokens.form.labelBottomMargin,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  interactiveBadge: {
    paddingVertical: tokens.modal.interactiveBadgePaddingVertical,
    paddingHorizontal: tokens.modal.interactiveBadgePaddingHorizontal,
    borderWidth: tokens.borderWidth.thin,
    borderColor: 'transparent',
  },
  badgeSelected: {
    borderColor: tokens.colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: tokens.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: tokens.modal.footerGap,
    marginTop: tokens.modal.footerTopSpacing,
    paddingTop: tokens.modal.footerTopPadding,
    borderTopWidth: tokens.borderWidth.hairline,
    borderTopColor: tokens.colors.border,
  },
  footerButton: {
    paddingVertical: tokens.modal.footerCancelPaddingVertical,
    paddingHorizontal: tokens.modal.footerCancelPaddingHorizontal,
  },
  footerButtonConfirm: {
    paddingVertical: tokens.modal.footerConfirmPaddingVertical,
    paddingHorizontal: tokens.modal.footerConfirmPaddingHorizontal,
  },
});

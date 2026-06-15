import { ScrollView, StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';
import DesignSystemNavigationPreview from '@/components/shared/DesignSystemNavigationPreview';
import DashboardScoreCard from '@/components/shared/DashboardScoreCard';
import TaskItem from '@/components/shared/TaskItem';
import QuickInsightsCard from '@/components/shared/QuickInsightsCard';
import CreateTaskModalPreview from '@/components/shared/CreateTaskModalPreview';

import ColorTokensSection from './components/ColorTokensSection';
import TypographyScaleSection from './components/TypographyScaleSection';
import SpacingScaleSection from './components/SpacingScaleSection';
import BorderRadiusSection from './components/BorderRadiusSection';
import TokenReferenceSection from './components/TokenReferenceSection';
import SectionLabel from './components/SectionLabel';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignSystemPreview() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>Design System</Text>
        <Text style={styles.headerTitle}>ABM</Text>
        <Text style={styles.headerSubtitle}>Hotel Operations Platform</Text>
      </View>

      <View style={styles.headerDivider} />

      {/* ── Foundations ────────────────────────────────────────────────── */}
      <ColorTokensSection />
      <TypographyScaleSection />
      <SpacingScaleSection />
      <BorderRadiusSection />

      {/* ── Components — Buttons ──────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Buttons" />
        <View style={styles.buttonRow}>
          <Button label="Create Task" variant="primary" onPress={() => {}} />
          <Button label="Edit" variant="secondary" onPress={() => {}} />
          <Button label="Cancel" variant="ghost" onPress={() => {}} />
          <Button label="Delete" variant="danger" onPress={() => {}} />
          <Button label="+ New" variant="primary" size="sm" onPress={() => {}} />
          <Button label="Delegate" variant="secondary" size="sm" onPress={() => {}} />
        </View>
      </View>

      {/* ── Components — Priority & Category Chips ────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Priority & Category Chips" />
        <View style={styles.chipRow}>
          <Chip label="Open" active tone="primary" />
          <Chip label="Recurring" />
          <Chip label="Done" />
        </View>
        <View style={styles.chipSpacer} />
        <View style={styles.chipRow}>
          <Badge label="High" variant="high" />
          <Badge label="Medium" variant="medium" />
          <Badge label="Low" variant="low" />
          <Badge label="Maintenance" variant="category" />
          <Badge label="Orders" variant="category" />
          <Badge label="Management" variant="category" />
        </View>
        <View style={styles.chipSpacer} />
        <View style={styles.chipRow}>
          <Chip label="Daily" active tone="warning" />
          <Chip label="Weekly" active tone="primary" />
          <Chip label="Monthly" />
        </View>
      </View>

      {/* ── Components — Form Inputs ──────────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Form Inputs" />
        <View style={styles.inputStack}>
          <Input label="Task title" placeholder="e.g. Restock seafood station" />
          <Input label="Due date" placeholder="2026-06-11" />
          <Input label="Search" placeholder="Search tasks..." />
        </View>
      </View>

      {/* ── Components — Navigation Bar ───────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Navigation Bar" />
        <DesignSystemNavigationPreview
          items={[
            { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
            { key: 'tasks', label: 'Tasks', icon: 'check-square' },
            { key: 'reviews', label: 'Reviews', icon: 'star' },
            { key: 'profile', label: 'Profile', icon: 'user' },
          ]}
          activeKey="dashboard"
        />
      </View>

      {/* ── Components — Dashboard Score Card ─────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Dashboard Score Card" />
        <View style={styles.scoreCardWrapper}>
          <DashboardScoreCard
            score={4.8}
            label="Overall Score"
            miniStats={[
              { value: 25, label: 'Critical' },
              { value: 15, label: 'Open' },
              { value: 50, label: 'Closed' },
            ]}
          />
        </View>
      </View>

      {/* ── Components — Task Item ────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Task Item" />
        <View style={styles.taskItemWrapper}>
          <TaskItem
            title="Restock Takeout Station"
            priority="high"
            categories={['Maintenance', 'Orders']}
            dueText="Due Today"
            recurrenceText="Weekly"
            checked={false}
            onToggle={() => {}}
          />
        </View>
      </View>

      {/* ── Components — Quick Insights ───────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Quick Insights" />
        <View style={styles.insightsWrapper}>
          <QuickInsightsCard
            items={[
              { id: '1', label: '3 tasks overdue', tone: 'danger', percentage: 60 },
              { id: '2', label: 'CSAT score slipping', tone: 'warning', percentage: 42 },
              { id: '3', label: 'Response time up 12%', tone: 'info', percentage: 72 },
              { id: '4', label: '14 reviews unactioned', tone: 'muted', percentage: 28 },
            ]}
          />
        </View>
      </View>

      {/* ── Components — Create Task Modal ────────────────────────────── */}
      <View style={styles.section}>
        <SectionLabel title="Components — Create Task Modal" />
        <View style={styles.modalWrapper}>
          <CreateTaskModalPreview
            outlet="Zan Zan Mini Budget, YMI"
            title=""
            selectedPriority="high"
            selectedRecurrence="weekly"
          />
        </View>
      </View>

      {/* ── Token Reference ───────────────────────────────────────────── */}
      <TokenReferenceSection />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    paddingHorizontal: tokens.spacing.lgMd,
    paddingBottom: tokens.spacing.xxlMd,
  },

  /* Header */
  header: {
    paddingTop: tokens.dsHeader.topPadding,
    paddingBottom: tokens.dsHeader.bottomPadding,
  },
  headerEyebrow: {
    fontSize: tokens.typography.fontSize.label,
    fontWeight: tokens.typography.fontWeight.semibold,
    letterSpacing: tokens.typography.letterSpacing.label,
    textTransform: 'uppercase',
    color: tokens.colors.textHint,
    marginBottom: tokens.dsHeader.eyebrowMarginBottom,
  },
  headerTitle: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.display,
    fontWeight: tokens.typography.fontWeight.regular,
    lineHeight: tokens.typography.lineHeight.display,
    letterSpacing: tokens.typography.letterSpacing.display,
    color: tokens.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: tokens.typography.fontSize.button,
    color: tokens.colors.textMuted,
    marginTop: tokens.dsHeader.subtitleMarginTop,
  },
  headerDivider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.dsHeader.dividerMarginBottom,
  },

  /* Generic section wrapper */
  section: {
    marginBottom: tokens.dsSection.marginBottom,
  },

  /* Buttons */
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
    alignItems: 'center',
  },

  /* Chips & Badges */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.s,
    alignItems: 'center',
  },
  chipSpacer: {
    height: tokens.spacing.sm,
  },

  /* Inputs */
  inputStack: {
    gap: tokens.spacing.md,
    maxWidth: 380,
  },

  /* Score card constrained width */
  scoreCardWrapper: {
    maxWidth: 300,
  },

  /* Task item constrained width */
  taskItemWrapper: {
    maxWidth: 360,
  },

  /* Insights constrained width */
  insightsWrapper: {
    maxWidth: 340,
  },

  /* Modal constrained width */
  modalWrapper: {
    maxWidth: 360,
  },
});

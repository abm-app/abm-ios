import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';
import DesignSystemNavigationPreview from '@/components/shared/DesignSystemNavigationPreview';

import ColorTokensSection from './components/ColorTokensSection';
import TypographyScaleSection from './components/TypographyScaleSection';
import SpacingScaleSection from './components/SpacingScaleSection';
import BorderRadiusSection from './components/BorderRadiusSection';
import TokenReferenceSection from './components/TokenReferenceSection';
import SectionLabel from './components/SectionLabel';

import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { CustomCalender } from '@/components/shared/CustomCalender';
import { ScreenHeaderV2 } from '@/components/shared/ScreenHeader-v2';
import { SharedFormModal } from '@/components/shared/SharedFormModal';
import { Avatar } from '@/components/shared/Avatar';
import { FilterSheet } from '@/components/shared/FilterSheet';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignSystemPreview() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
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

        {/* ── Components — Migrated ─────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionLabel title="Components — Migrated from zz-ios" />

          <View style={styles.componentWrapper}>
            <ScreenHeaderV2
              title="Header Title"
              subtitle="Subtitle here"
              showSearch
              showFilter
              showRightButton
            />
          </View>

          <View style={styles.buttonRow}>
            <Avatar name="John Doe" size={40} />
            <Avatar name="Jane Smith" size={40} overlap />
          </View>

          <View style={[styles.buttonRow, styles.buttonRowMargin]}>
            <Button label="Show Confirm" variant="secondary" onPress={() => setShowConfirm(true)} />
            <Button
              label="Show Calendar"
              variant="secondary"
              onPress={() => setShowCalendar(true)}
            />
            <Button label="Show Form" variant="secondary" onPress={() => setShowFormModal(true)} />
            <Button
              label="Show Filter"
              variant="secondary"
              onPress={() => setShowFilterSheet(true)}
            />
          </View>

          <ConfirmationModal
            visible={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => setShowConfirm(false)}
            title="Confirm Action"
            content="Are you sure you want to do this?"
            confirmLabel="Yes, Do it"
          />
          <CustomCalender visible={showCalendar} onClose={() => setShowCalendar(false)} />
          <SharedFormModal
            visible={showFormModal}
            onClose={() => setShowFormModal(false)}
            onSubmit={() => setShowFormModal(false)}
            title="Form Modal"
            buttonLabel="Submit"
          >
            <Text>Form Content Here</Text>
          </SharedFormModal>
          <FilterSheet
            visible={showFilterSheet}
            onClose={() => setShowFilterSheet(false)}
            title="Filters"
            showDragIndicator
          >
            <Text>Filter options here</Text>
          </FilterSheet>
        </View>

        {/* ── Token Reference ───────────────────────────────────────────── */}
        <TokenReferenceSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
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
    maxWidth: tokens.input.maxWidth,
  },
  componentWrapper: {
    marginBottom: 16,
  },
  buttonRowMargin: {
    marginTop: 16,
  },
});

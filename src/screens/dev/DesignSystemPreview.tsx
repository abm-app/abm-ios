import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import tokens from '@/theme/tokens';
import { Button } from '@/components/ui';
import Badge from '@/components/ui/Badge';
import Chip from '@/components/ui/Chip';
import Input from '@/components/ui/Input';

import ColorTokensSection from './components/ColorTokensSection';
import TypographyScaleSection from './components/TypographyScaleSection';
import SpacingScaleSection from './components/SpacingScaleSection';
import BorderRadiusSection from './components/BorderRadiusSection';
import TokenReferenceSection from './components/TokenReferenceSection';
import SectionLabel from './components/SectionLabel';
import MigratedComponentsSection from './components/MigratedComponentsSection';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignSystemPreview() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Fixed Header ────────────────────────────────────────────────────── */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitleH1}>Design System</Text>
      </View>

      <View style={styles.headerDivider} />

      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
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

        {/* ── Components — Migrated ─────────────────────────────────────── */}
        <MigratedComponentsSection />

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
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lgMd,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.background,
  },
  backButton: {
    marginRight: tokens.spacing.md,
  },
  headerTitleH1: {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: tokens.typography.fontSize.h1,
    fontWeight: tokens.typography.fontWeight.semibold,
    lineHeight: tokens.typography.lineHeight.h1,
    color: tokens.colors.textPrimary,
  },
  headerDivider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.md,
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

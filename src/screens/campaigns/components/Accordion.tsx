import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tokens from '@/theme/tokens';

interface AccordionProps {
  title: string;
  count?: number;
  initialExpanded?: boolean;
  children: React.ReactNode;
}

export interface AccordionHeaderProps {
  title: string;
  count?: number;
  expanded: boolean;
  onToggle: () => void;
}

export function AccordionHeader({ title, count, expanded, onToggle }: AccordionHeaderProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.header} activeOpacity={0.7}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {count !== undefined && <Text style={styles.count}>({count})</Text>}
      </View>
      <Feather
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={tokens.iconSizes.content}
        color={tokens.colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

export function Accordion({ title, count, initialExpanded = true, children }: AccordionProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <AccordionHeader title={title} count={count} expanded={expanded} onToggle={toggle} />
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.mdLg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  title: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },
  count: {
    fontFamily: tokens.typography.fontFamily.sub,
    fontSize: tokens.typography.fontSize.subhead,
    color: tokens.colors.textMuted,
  },
  content: {
    marginTop: tokens.spacing.sm,
  },
});

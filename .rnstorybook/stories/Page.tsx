import { useState } from 'react';

import { Linking, StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import { Header } from './Header';

export const Page = () => {
  const [user, setUser] = useState<{ name: string } | undefined>();

  return (
    <View>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />

      <View style={styles.section}>
        <Text role="heading" style={styles.h2}>
          Pages in Storybook
        </Text>
        <Text style={styles.p}>
          We recommend building UIs with a{' '}
          <Text
            style={[styles.a, styles.bold]}
            role="link"
            onPress={() => {
              Linking.openURL('https://componentdriven.org');
            }}
          >
            <Text>component-driven</Text>
          </Text>{' '}
          process starting with atomic components and ending with pages.
        </Text>
        <Text style={styles.p}>
          Render pages with mock data. This makes it easy to build and review page states without
          needing to navigate to them in your app. Here are some handy patterns for managing page
          data in Storybook:
        </Text>
        <View>
          <Text>
            Use a higher-level connected component. Storybook helps you compose such data from the
            "args" of child component stories
          </Text>
          <Text>
            Assemble data in the page component from your services. You can mock these services out
            using Storybook.
          </Text>
        </View>
        <Text style={styles.p}>
          Get a guided tutorial on component-driven development at{' '}
          <Text
            style={styles.a}
            role="link"
            onPress={() => {
              Linking.openURL('https://storybook.js.org/tutorials/');
            }}
          >
            Storybook tutorials
          </Text>
          . Read more in the{' '}
          <Text
            style={styles.a}
            role="link"
            onPress={() => {
              Linking.openURL('https://storybook.js.org/docs');
            }}
          >
            docs
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    fontFamily: tokens.fonts.body,
    fontSize: tokens.typography.fontSize.md,
    lineHeight: tokens.spacing.xl,
    paddingVertical: tokens.spacing.xxxl,
    paddingHorizontal: tokens.spacing.lgMd,
    alignSelf: 'center',
    maxWidth: 600,
    color: tokens.colors.textSecondary,
  },

  h2: {
    fontWeight: tokens.fontWeights.black,
    fontSize: tokens.typography.fontSize.xl,
    lineHeight: 1,
    marginBottom: tokens.spacing.xs,
  },

  p: {
    marginVertical: tokens.spacing.lg,
    marginHorizontal: 0,
  },

  a: {
    color: tokens.colors.brand,
  },
  bold: {
    fontWeight: tokens.fontWeights.bold,
  },

  ul: {
    paddingLeft: tokens.spacing.xlMd,
    marginVertical: tokens.spacing.lg,
  },

  li: {
    marginBottom: tokens.spacing.sm,
  },

  tip: {
    alignSelf: 'flex-start',
    borderRadius: tokens.borderRadius.lg,
    backgroundColor: tokens.colors.successLight,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.md,
    marginRight: tokens.spacing.smMd,
    marginBottom: tokens.spacing.xs,
  },
  tipText: {
    fontSize: tokens.typography.fontSize.label,
    lineHeight: tokens.spacing.md,
    fontWeight: tokens.fontWeights.bold,
    color: tokens.colors.tipGreen,
  },

  tipWrapper: {
    fontSize: tokens.typography.fontSize.sm,
    lineHeight: tokens.spacing.lgMd,
    marginTop: tokens.spacing.xxlMd,
    marginBottom: tokens.spacing.xxlMd,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tipWrapperSvg: {
    height: tokens.spacing.md,
    width: tokens.spacing.md,
    marginRight: tokens.spacing.xs,
    marginTop: tokens.spacing.xs,
  },
});

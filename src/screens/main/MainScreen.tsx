import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import DevTrigger from '@/screens/dev/DevTrigger';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
      <DevTrigger />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textMuted,
  },
});

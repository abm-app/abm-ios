import { StyleSheet, Text, View } from 'react-native';

import tokens from '@/theme/tokens';
import { Button } from './Button';

export type HeaderProps = {
  user?: { name: string };
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
};

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <View>
    <View style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Text style={styles.h1}>Acme</Text>
      </View>
      <View style={styles.buttonContainer}>
        {user ? (
          <>
            <Text>Welcome, </Text>
            <Text style={styles.userName}>{user.name}!</Text>

            <Button style={styles.button} size="small" onPress={onLogout} label="Log out" />
          </>
        ) : (
          <>
            <Button style={styles.button} size="small" onPress={onLogin} label="Log in" />

            <Button
              style={styles.button}
              primary
              size="small"
              onPress={onCreateAccount}
              label="Sign up"
            />
          </>
        )}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: tokens.borderWidth.thin,
    borderBottomColor: tokens.colors.border,
    paddingVertical: tokens.spacing.mdLg,
    paddingHorizontal: tokens.spacing.lgMd,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  h1: {
    fontWeight: tokens.fontWeights.black,
    fontSize: tokens.typography.fontSize.h2,
    marginTop: tokens.spacing.s,
    marginBottom: tokens.spacing.s,
    marginLeft: tokens.spacing.smMd,
    color: tokens.colors.primary,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: tokens.spacing.smMd,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: tokens.fontWeights.bold,
  },
});

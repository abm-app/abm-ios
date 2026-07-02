import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_PREVIEW = process.env.APP_ENV === 'preview';

const bundleIdentifier = IS_PREVIEW ? 'com.abm.app.preview' : 'com.abm.app';
const appName = IS_PREVIEW ? 'ABM Preview' : 'ABM';

// EAS project IDs — production uses the existing one, preview uses the new account's project.
// Replace REPLACE_WITH_PREVIEW_PROJECT_ID below once you have run `eas init` on the new account.
const easProjectId = IS_PREVIEW
  ? 'REPLACE_WITH_PREVIEW_PROJECT_ID'
  : 'a427f36a-865c-49f5-bbf5-2a9e4b82219c';

// Expo owner — production is lplusdevelopers, preview is your new account slug.
// Replace REPLACE_WITH_NEW_ACCOUNT_SLUG with the slug of the new Expo account.
const owner = IS_PREVIEW ? 'REPLACE_WITH_NEW_ACCOUNT_SLUG' : 'lplusdevelopers';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: 'abm-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'abm',
  splash: {
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
  },
  ios: {
    bundleIdentifier,
    supportsTablet: false,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  owner,
  plugins: [
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/AncizarSerif-Regular.ttf',
          './assets/fonts/AncizarSerif-Italic.ttf',
          './assets/fonts/AncizarSerif-Bold.ttf',
          './assets/fonts/AncizarSerif-BoldItalic.ttf',
        ],
      },
    ],
    'expo-secure-store',
  ],
  extra: {
    eas: {
      projectId: easProjectId,
    },
  },
});

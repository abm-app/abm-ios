import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_PREVIEW = process.env.APP_ENV === 'preview';

const bundleIdentifier = IS_PREVIEW ? 'com.abm.app.preview' : 'com.ceyxasm.abm';
const androidPackage = IS_PREVIEW ? 'com.abm.android.preview' : 'com.abm.android';
const appName = IS_PREVIEW ? 'ABM Preview' : 'ABM';

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
    image: './assets/icon.png',
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
  },
  ios: {
    bundleIdentifier,
    supportsTablet: false,
    buildNumber: '10',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: androidPackage,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#ffffff',
    },
  },
  owner: 'lplusdevelopers',
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
      projectId: 'a427f36a-865c-49f5-bbf5-2a9e4b82219c',
    },
  },
});


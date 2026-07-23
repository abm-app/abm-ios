import type { ExpoConfig, ConfigContext } from 'expo/config';

const IS_PREVIEW = process.env.APP_ENV === 'preview';

const bundleIdentifier = IS_PREVIEW ? 'com.ceyxasm.abm.preview' : 'com.ceyxasm.abm';
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
  owner: 'ceyxasm',
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
      projectId: '1bfd15cc-fae0-4808-af7c-c527934eabea',
    },
  },
});


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
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: androidPackage,
    versionCode: 1,
    googleServicesFile: './google-services.json',
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
    [
      'expo-notifications',
      {
        // All distributable build profiles (preview/internal/production) sign with an
        // Ad Hoc or App Store profile, which requires the 'production' APNs environment.
        // The only profile that would need 'development' is `development` in eas.json,
        // but that one targets iOS Simulator only (ios.simulator: true), and Simulator
        // can never receive push at all — so there's no profile that actually needs
        // 'development' here.
        mode: 'production',
        // FCM/local notifications default to this channel if none is specified.
        // The channel itself still has to be created at runtime via
        // Notifications.setNotificationChannelAsync (Android 8+ requirement) — done in
        // the app's notification listener setup, not here.
        defaultChannel: 'default',
        enableBackgroundRemoteNotifications: true,
        // No custom notification icon/color yet — Android wants a flat white/transparent
        // silhouette (not the full-color app icon), which doesn't exist as an asset yet.
        // Falls back to the OS default bell icon until a real one is designed.
      },
    ],
  ],
  extra: {
    eas: {
      projectId: 'a427f36a-865c-49f5-bbf5-2a9e4b82219c',
    },
  },
});


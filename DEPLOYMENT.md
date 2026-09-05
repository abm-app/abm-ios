# ABM App Deployment Guide

This document outlines how to build and deploy the ABM app (iOS & Android) for both Preview (testing) and Production environments using Expo Application Services (EAS).

## Prerequisites

Before building, ensure you have the following installed:
1. **EAS CLI**: Install globally via npm:
   ```bash
   npm install -g eas-cli
   ```
2. **Expo Account**: Ensure you are logged into your Expo account:
   ```bash
   eas login
   ```
3. **Apple Developer Account**: Required for iOS builds. You must be an admin of the Apple Developer account associated with this app.
4. **Google Play Developer Account**: Required for Android builds. The account has been purchased.
5. **Android SDK** (for local builds): Required if building Android locally without EAS. Android Studio provides this.

## Build Profiles

The app uses `eas.json` to define build profiles.

- **`development`**: Local development builds (iOS Simulator / Android emulator).
- **`preview`**: Used for internal testing and staging. Points to testing environments. Distributes via TestFlight (iOS) and the Play Internal Testing track via an AAB (Android).
- **`internal`**: APK sideloading and QR-code installs for Android (preview environment). Produces an `.apk`, not an `.aab`; do not submit it to the Play Store.
- **`production`**: Used for the final release to the App Store (iOS) and Play Store (Android).

---

## 1. iOS Builds

### Preview Build (TestFlight)

The `preview` profile is configured for testing. It uses `distribution: "store"`, meaning it is intended to be uploaded to TestFlight.

```bash
eas build --profile preview --platform ios
```

To auto-submit to TestFlight after building:

```bash
eas build --profile preview --platform ios --auto-submit
```
*Note: You will be prompted to authenticate with your Apple ID during the submission process.*

### Production Build (App Store)

```bash
eas build --profile production --platform ios
```

To auto-submit to the App Store:

```bash
eas build --profile production --platform ios --auto-submit
```

---

## 2. Android Builds

### Preview Build (Play Internal Testing)

The `preview` profile produces an `.aab` (Android App Bundle) for the Play Store, including the Internal Testing track.

```bash
eas build --profile preview --platform android
```

To submit to Google Play Internal Testing track:

```bash
eas submit --platform android --profile preview
```

### Internal Testing Build (APK for Sideloading)

If you need an APK instead of an AAB — for example to install directly on a device without the Play Store — use the `internal` profile, which produces an `.apk`.

```bash
eas build --profile internal --platform android
```

The `internal` APK cannot be submitted to the Play Store because it uses a different signing configuration path; use the `preview` AAB above for any Play Console submission.

### Production Build (Play Store)

The `production` profile produces a release `.aab` for the Play Store.

```bash
eas build --profile production --platform android
```

To submit to Google Play:

```bash
eas submit --platform android --profile production
```

### Android Signing

EAS can auto-manage the Android signing key (recommended). On first build, EAS will generate and store the keystore remotely. If you prefer to use your own keystore:

```bash
eas credentials --platform android
```

> **Important:** If not using EAS-managed signing, back up your keystore securely. Losing it blocks all future updates to the published app.

---

## 3. Local Development with Expo Go

Start the local dev server:

```bash
pnpm start
```

Then scan the QR code:
- **iOS:** Scan with the Camera app.
- **Android:** Scan with the Expo Go app (install from Play Store).

### Building for Simulators/Emulators

```bash
# iOS Simulator
eas build --profile development --platform ios

# Android Emulator
eas build --profile development --platform android
```

---

## Environment Variables

Both `preview` and `production` builds rely on environment variables defined in `eas.json`. Ensure the following keys are correctly set in your target environment:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_USE_MOCK_AUTH`

*(Do not commit sensitive secrets to `eas.json`. For secrets, use Expo EAS Secrets: `eas secret:create`)*

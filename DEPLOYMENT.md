# ABM iOS App Deployment Guide

This document outlines how to build and deploy the ABM iOS app for both Preview (testing) and Production environments using Expo Application Services (EAS).

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
3. **Apple Developer Account**: You must be an admin of the Apple Developer account associated with this app.

## Build Profiles

The app uses `eas.json` to define build profiles.

- **`development`**: Local development builds (for simulators).
- **`preview`**: Used for internal testing and staging. It points to testing environments and distributes via TestFlight or internal store.
- **`production`**: Used for the final release to the App Store.

---

## 1. Preview Build

The `preview` profile is configured for testing. According to `eas.json`, it uses `distribution: "store"`, meaning it is intended to be uploaded to TestFlight for previewing.

To trigger a preview build for iOS:

```bash
eas build --profile preview --platform ios
```

### Submitting to TestFlight
If you want EAS to automatically submit the app to TestFlight after the build completes, run:

```bash
eas build --profile preview --platform ios --auto-submit
```
*Note: You will be prompted to authenticate with your Apple ID during the submission process.*

---

## 2. Production Build

The `production` profile is configured for the final release. It uses the production API environments and auto-increments the build number.

To trigger a production build for iOS:

```bash
eas build --profile production --platform ios
```

### Submitting to the App Store
To automatically submit to the App Store (via TestFlight/App Store Connect) after building:

```bash
eas build --profile production --platform ios --auto-submit
```

---

## Testing with Expo Go (Local Development)

If you simply want to preview the app locally during development using the **Expo Go** app on your physical device, you do not need to run an EAS build. Instead, start the local dev server:

```bash
npx expo start
```
Then, scan the QR code using the camera on your iPhone to open the app in Expo Go.

### Building for iOS Simulator
If you want to create a standalone build specifically for the iOS Simulator:

```bash
eas build --profile development --platform ios --auto-submit
```
Once the build is complete, EAS CLI will prompt you to automatically install and run it on your running simulator.

---

## Environment Variables

Both `preview` and `production` builds rely on environment variables defined in `eas.json`. Ensure the following keys are correctly set in your target environment:

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_USE_MOCK_AUTH`

*(Do not commit sensitive secrets to `eas.json`. For secrets, use Expo EAS Secrets: `eas secret:create`)*

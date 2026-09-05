# Android Deployment — Ways to Run the Build on a Device

This doc covers the different ways to get an Android build of `abm-ios` running on a physical device or emulator, in order of what's fastest for local testing vs closest to production.

---

## 1. Sideload the APK

Manually install an APK file on your device without the Play Store. Best for quick one-off testing of a build you already have as an `.aab`.

**Important:** This local workflow signs the APK with a generated debug keystore. If the device already has the same package installed from a Play or EAS release, the install will be rejected due to a signature mismatch unless you use the matching release keystore. For that case, either uninstall the existing app first, use the release keystore that matches the installed build, or use the `internal` APK profile (Option 3) instead.

**Steps:**

1. Download the `.aab` from the EAS build page (Builds → select build → **Download** next to "Build artifact").
2. Move it into your project root and rename for convenience:
   ```bash
   mv <downloaded-file>.aab app.aab
   ```
3. Download `bundletool` if not already present:
   ```bash
   curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.16.0/bundletool-all-1.16.0.jar
   ```
4. Generate a debug keystore (one-time, reusable across builds):
   ```bash
   keytool -genkey -v -keystore debug.keystore -storetype PKCS12 \
     -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 \
     -storepass android -keypass android \
     -dname "CN=Android Debug,O=Android,C=US"
   ```
5. Convert the AAB into an installable APK set:
   ```bash
   java -jar bundletool.jar build-apks \
     --bundle=app.aab \
     --output=app.apks \
     --mode=universal \
     --ks=debug.keystore \
     --ks-pass=pass:android \
     --ks-key-alias=androiddebugkey \
     --key-pass=pass:android
   ```
6. Extract the actual `.apk` file:
   ```bash
   unzip app.apks -d app_apks_extracted
   ```
   `universal.apk` will be inside `app_apks_extracted/`.
7. Transfer `universal.apk` to your phone (USB cable, cloud drive, email — any method).
8. On the phone: enable **Install unknown apps** for the source app you're using (Settings → Apps → Special access → Install unknown apps), then open the file and install.

**When to use:** Fast, no Play Console dependency, works for any build as long as you either use a clean device/emulator or understand the sign conflict above. Good default for personal device testing during development.

---

## 2. Internal Testing Track (Play Console)

Upload the build to Google Play and install via the real Play Store app. Closest to what production/end-users will experience — correct signing, Play-managed updates, Data Safety disclosures actually enforced.

**Steps:**

1. In [Play Console](https://play.google.com/console), open the app → **Testing → Internal testing**.
2. Click **Create new release**.
3. Upload the `.aab` (not the sideload APK) — either drag-and-drop the downloaded file, or submit directly from EAS:
   ```bash
   eas submit --platform android --profile preview
   ```
   (requires `eas.json` submit config with your Play service account key — set up once, reused after)
4. Fill in release notes, save, and roll out to Internal Testing.
5. Add testers: **Internal testing → Testers** tab → add tester email addresses (must be Google accounts) or create a Google Group.
6. Share the **opt-in URL** Play Console generates with your testers.
7. Testers open the link on their Android device, opt in, then install the app directly from the Play Store app (search may take a few minutes to index, but the direct link works immediately).

**When to use:** Before wider rollout, for validating the real signing/production pipeline, Data Safety form behavior, and how the app behaves when installed the way real users will install it. Slower iteration than sideloading (upload + processing time), so not ideal for rapid dev loops.

---

## 3. EAS Build with `buildType: apk` + QR Code

Have EAS output an APK directly instead of an AAB, skipping the bundletool conversion step entirely.

**Steps:**

1. In `eas.json`, use the `internal` profile, which is configured to output an APK for Android:
   ```json
   {
     "build": {
       "internal": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```
2. Run the build:
   ```bash
   eas build --platform android --profile internal
   ```
3. Once finished, the EAS build page shows a **QR code** alongside the download link.
4. On your Android phone, scan the QR code (via camera app or Expo Go, depending on setup) — this opens the direct APK download link on-device.
5. Download and install directly from the phone — no manual transfer needed, no bundletool step.

**When to use:** Best repeatable option for on-device testing during active Android work — one command, no local conversion, no cable required. Use this as the default going forward instead of Option 1.

---

## 4. `adb install` (USB-connected device)

Push an APK straight to a connected device via command line.

**Prerequisites:** USB debugging enabled on the phone (Settings → About phone → tap Build number 7x → Developer options → USB debugging), device connected via USB and authorized.

**Steps:**

```bash
adb devices        # confirm device is detected and authorized
adb install app_apks_extracted/universal.apk
```

Or, skip the manual extraction step and let bundletool push it directly:
```bash
java -jar bundletool.jar install-apks --apks=app.apks
```

**When to use:** Fastest loop when you're at your desk with the phone plugged in and iterating on native build issues.

---

## 5. Expo Dev Client / `expo run:android`

For active development — hot reload, live debugging — rather than testing a finished build.

**Steps:**

```bash
pnpm android
```

If the direct Expo invocation is required, use the project-standard pnpm exec wrapper:

```bash
pnpm exec expo run:android
```

This builds a dev client and installs it on a connected device or running emulator, then connects to the Metro bundler for live reload.

**When to use:** Day-to-day development work, not for testing production-like builds. Requires Android SDK/tooling set up locally (Android Studio installed, `ANDROID_HOME` configured).

---

## 6. Android Emulator

Run the app on a virtual device instead of physical hardware.

**Steps:**

1. Install Android Studio, open **Device Manager**, create an AVD (pick a device profile + system image).
2. Start the emulator.
3. Install the build the same way as a physical device:
   - `adb install <path-to-apk>`, or
   - `pnpm android` (auto-detects the running emulator as the target)

**When to use:** No physical Android device available, or need to quickly test across multiple Android versions/screen sizes without owning several phones.

---

## Recommendation

- **Rapid local testing during Android compatibility work:** Option 3 (EAS APK + QR) or Option 4 (`adb install`) if already on USB.
- **Pre-release validation before wider rollout:** Option 2 (Internal Testing track) — this is the only option that exercises real Play Store signing and Data Safety enforcement.
- **Active development / hot reload:** Option 5.
- **No device on hand:** Option 6.

# ABM iOS

ABM is an iOS-only hotel management app for ABM Express and ABM International. It is built with React Native, Expo managed workflow, TypeScript, TanStack Query, Zustand, and Axios.

The app is a rendering layer for the ABM backend API. Business logic belongs on the backend, while this repository focuses on navigation, screens, UI composition, API calls, and client-side state needed to render the mobile experience.

## Tech Stack

- React Native `0.81`
- Expo `54`
- TypeScript
- TanStack Query
- Zustand
- Axios
- React Navigation
- Expo SecureStore
- pnpm with hoisted node linker

## Requirements

- Node.js compatible with Expo SDK 54
- pnpm
- Xcode with an iOS Simulator
- Expo CLI through `pnpm exec expo` or the package scripts
- Access to the ABM backend API

This project is iOS-only. Do not add Android-specific setup, configuration, code paths, or dependencies.

## Local Setup

1. Clone the repository.

   ```bash
   git clone <repo-url>
   cd abm-ios
   ```

2. Install dependencies with pnpm.

   ```bash
   pnpm install
   ```

3. Create a local environment file.

   ```bash
   cp .env.example .env
   ```

4. Set the backend API URL in `.env`.

   ```bash
   EXPO_PUBLIC_API_URL=https://your-api-url.example.com
   ```

5. Start the app on iOS.

   ```bash
   pnpm ios
   ```

   You can also start the Expo dev server manually:

   ```bash
   pnpm start
   ```

   Then press `i` in the Expo terminal to open the iOS Simulator.

## Environment Variables

The app reads environment variables only from `src/config/env.ts`.

| Variable | Required | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | Yes | Base URL for the ABM backend API. |
| `EXPO_PUBLIC_USE_MOCK_AUTH` | No | Set to `true` only when using the local mock auth flow. |

Never read `process.env` directly outside `src/config/env.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start the Expo development server. |
| `pnpm ios` | Start Expo and open the iOS Simulator. |
| `pnpm lint` | Run ESLint with zero warnings allowed. |
| `pnpm type-check` | Run TypeScript checks without emitting files. |
| `pnpm format` | Format TypeScript source files with Prettier. |

Before submitting code, run:

```bash
pnpm type-check
pnpm lint
pnpm format
```

## Project Structure

```text
src/
  api/
    client.ts          Axios client
    endpoints/         Typed API endpoint modules
    queryClient.ts     TanStack Query client
    storage.ts         Secure token storage
  components/
    ui/                Primitive design-system components
    shared/            Reusable composed components
  config/
    env.ts             Central environment variable access
  hooks/               Domain hooks and query keys
  navigation/          Root, auth, and app navigators
  screens/             Screen modules
  store/               Zustand stores
  theme/               Design tokens and theme utilities
  types/               Shared domain types
  utils/               Pure helpers and utilities
```

## Architecture Notes

- API calls live in `src/api/endpoints/`.
- Hooks live in `src/hooks/` and own their TanStack Query keys.
- Screens compose components and call hooks. They should not contain API calls or business logic.
- Auth tokens are stored with Expo SecureStore through `src/api/storage.ts`.
- The Axios client attaches the access token from the auth store and clears the session on `401` responses.
- Tab visibility is controlled by the backend-provided modules array.

## Design System

All design values come from `src/theme/tokens.ts`.

Use tokens for colors, spacing, border radius, font sizes, font families, and border widths. If a value does not exist, add it to the token file first and then use it from there.

Components must use `StyleSheet.create()`. Do not use inline style objects in JSX.

## Component Guidelines

- Reuse existing components before creating new ones.
- Primitive UI components live in `src/components/ui/`.
- Reusable composed components live in `src/components/shared/`.
- Components used by only one screen can live under that screen's local `components/` folder.
- Top-level components should be named functions, not arrow functions.
- Export UI primitives from `src/components/ui/index.ts`.
- Export shared components from `src/components/shared/index.ts`.

## API and State Guidelines

- Import `apiClient` only inside `src/api/endpoints/`.
- Do not call `useQuery` or `useMutation` directly from screens.
- Server state belongs in TanStack Query.
- Auth state belongs in `src/store/authStore.ts`.
- Most UI state should stay local with React state.
- Do not create new Zustand stores unless persistent shared state is genuinely required.

## iOS Builds

EAS build profiles are defined in `eas.json`.

Development simulator build:

```bash
eas build --profile development --platform ios
```

Internal preview build:

```bash
eas build --profile preview --platform ios
```

Production build:

```bash
eas build --profile production --platform ios
```

Production submission:

```bash
eas submit --platform ios
```

## Development Rules

- Use pnpm only.
- Keep the app iOS-only.
- Keep TypeScript strict.
- Do not commit `console.log` statements.
- Do not commit commented-out code.
- Prefer union types over enums for API string values.
- Use `@expo/vector-icons`, with Feather as the primary icon set.
- Keep backend business logic out of the app.

For the full contributor and agent guidelines, read `AGENTS.md`.

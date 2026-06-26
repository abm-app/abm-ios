# AGENTS.md — ABM iOS App

This file is the authoritative guide for any AI agent working in this repository.
Read it in full before writing, editing, or deleting any code.

---

## Project Overview

**ABM** is an iOS-only hotel management app for ABM Express and ABM International.
Built with React Native + Expo (managed workflow), TypeScript, TanStack Query, Zustand, and Axios.
The backend is a NestJS API. The app is a rendering layer only — no business logic lives here.

---

## Non-Negotiable Rules

These apply to every task, no exceptions. Violating any of these is grounds to reject the output.

1. **iOS only.** Never add Android-specific code, config, plugins, or `Platform.OS === 'android'` checks. Do not modify `app.json` for Android. If a library requires Android-specific setup, note it and skip that part.
2. **TypeScript strict.** `noImplicitAny` and `strictNullChecks` are enabled. Never use `any` as a type. Always use proper types. Never suppress lint errors using lint comments (like `// @ts-ignore`, `// @ts-expect-error`, or `// eslint-disable`). Always resolve them correctly.
3. **No inline styles.** Every style value must come from `StyleSheet.create()`. No style objects defined inline in JSX (`style={{ color: 'red' }}`). No hardcoded hex values, spacing numbers, or font sizes in component files — use tokens (see Design System section).
4. **No hardcoded design values.** Colors, spacing, border radius, font sizes, and font families must always be read from `src/theme/tokens.ts`. If a value is not in tokens, add it to tokens first, then use it.
5. **Reuse before creating.** Before building a new component, check `src/components/ui/` and `src/components/shared/` for something that already does the job. If a component is used in more than one screen, it must live in `src/components/` — not inside a screen folder.
6. **No business logic in screens.** Screens compose components and call hooks. Logic lives in hooks (`src/hooks/`) or utilities (`src/utils/`). API calls live in endpoint modules (`src/api/endpoints/`).
7. **No raw `apiClient` outside `src/api/endpoints/`.** Import the Axios client only inside endpoint files. Screens and hooks never import `apiClient` directly.
8. **No `process.env` outside `src/config/env.ts`.** All environment variable access is centralised there.
9. **Tokens are stored in `expo-secure-store`.** Never in `AsyncStorage`, never in memory alone. Use the helpers in `src/api/storage.ts`.
10. **pnpm only.** Never use `npm install` or `yarn add`. Package manager is pnpm with `node-linker=hoisted`.
11. **Rule Enforcement.** Read this `AGENTS.md` file every time after making any changes to ensure the rules are followed.

---

## Repository Structure

```
abm-app/
├── src/
│   ├── api/
│   │   ├── client.ts               # Axios instance — import ONLY inside endpoints/
│   │   ├── queryClient.ts          # TanStack Query client instance
│   │   ├── storage.ts              # expo-secure-store helpers (read/write/delete tokens)
│   │   └── endpoints/              # One file (or folder) per API domain
│   │       ├── authApi.ts
│   │       ├── auditApi.ts
│   │       ├── dashboardApi.ts
│   │       ├── guestsApi.ts
│   │       ├── notificationsApi.ts
│   │       ├── revenueApi.ts
│   │       ├── reportsApi.ts
│   │       └── statusApi.ts
│   │
│   ├── components/
│   │   ├── ui/                     # Primitive design-system components (Button, Badge, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts            # Barrel export — always import from here
│   │   └── shared/                 # Composed components reused across 2+ screens
│   │       └── (see Component Rules section)
│   │
│   ├── config/
│   │   └── env.ts                  # Single source for all process.env reads
│   │
│   ├── constants/
│   │   └── (app-wide constants — not design values, those go in theme/tokens.ts)
│   │
│   ├── hooks/                      # TanStack Query hooks, organised by domain
│   │   ├── auth/
│   │   ├── audit/
│   │   ├── dashboard/
│   │   ├── guests/
│   │   ├── notifications/
│   │   ├── revenue/
│   │   ├── reports/
│   │   └── status/
│   │
│   ├── navigation/
│   │   ├── types.ts                # All navigator param lists and ModuleKey type
│   │   ├── RootNavigator.tsx       # Auth gate — renders AuthStack or AppNavigator
│   │   ├── AppNavigator.tsx        # Bottom tab navigator, role-filtered
│   │   └── AuthNavigator.tsx       # Auth stack (Login screen)
│   │
│   ├── screens/                    # One folder per module. Screens are thin — compose + call hooks.
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── dashboard/
│   │   ├── live-status/
│   │   ├── audit-trail/
│   │   ├── revenue/
│   │   ├── reports/
│   │   ├── loyalty/
│   │   ├── notifications/
│   │   └── user-management/
│   │
│   ├── store/
│   │   └── authStore.ts            # Zustand auth store (tokens, user, role, modules)
│   │
│   ├── theme/
│   │   └── tokens.ts               # THE source of truth for all design values
│   │
│   ├── types/
│   │   └── (shared TypeScript interfaces and enums)
│   │
│   └── utils/
│       └── (pure helper functions — formatting, normalisation, etc.)
│
├── assets/                         # App icon, splash, images
├── .env                            # Local only — gitignored
├── .env.example                    # Committed — shows required keys with empty values
├── .npmrc                          # node-linker=hoisted, shamefully-hoist=true
├── app.json
├── babel.config.js
├── eas.json
├── tsconfig.json
└── AGENTS.md                       # This file
```

---

## Design System — The Single Source of Truth

**All design values live in `src/theme/tokens.ts` and nowhere else.**

This is the contract: if a color, spacing value, font size, border radius, or font family is not in `tokens.ts`, it does not exist as far as this codebase is concerned. Add it to tokens first. Use it from tokens everywhere.

### What tokens.ts contains

```typescript
// src/theme/tokens.ts

export const colors = {
  primary: '#000000',
  white: '#FFFFFF',
  surface: '#F9F9F9',
  border: 'rgba(0,0,0,0.10)',
  borderMd: 'rgba(0,0,0,0.18)',
  textPrimary: '#000000',
  textMuted: '#666666',
  textHint: '#999999',
  danger: '#C0392B',
  warning: '#E67E22',
  success: '#27AE60',
  info: '#2471A3',
  // Badge backgrounds and text
  badgeHighBg: 'rgba(192,57,43,0.10)',
  badgeHighText: '#C0392B',
  badgeMedBg: 'rgba(230,126,34,0.10)',
  badgeMedText: '#E67E22',
  badgeLowBg: 'rgba(39,174,96,0.10)',
  badgeLowText: '#27AE60',
  badgeCatBg: 'rgba(0,0,0,0.06)',
  badgeCatText: '#333333',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 100,
} as const;

export const fontSize = {
  display: 36,
  h1: 26,
  h2: 20,
  subhead: 15,
  body: 15,
  caption: 12,
  label: 11,
  numeric: 28,
} as const;

export const fontFamily = {
  heading: 'Georgia', // Fallback for Ancizar Serif until custom font loads
  sub: 'Inter_400Regular', // Inter via expo-google-fonts or system
  body: undefined, // System default — SF Pro on iOS
} as const;

export const borderWidth = {
  hairline: 0.5,
  thin: 1,
} as const;

const tokens = { colors, spacing, radius, fontSize, fontFamily, borderWidth };
export type Tokens = typeof tokens;
export default tokens;
```

### How to use tokens in a component

```typescript
// CORRECT
import tokens from '@/theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    borderWidth: tokens.borderWidth.hairline,
    borderColor: tokens.colors.border,
    padding: tokens.spacing.lg,
  },
  title: {
    fontSize: tokens.fontSize.subhead,
    color: tokens.colors.textPrimary,
  },
});

// WRONG — never do this
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9', // ❌ hardcoded
    borderRadius: 16, // ❌ hardcoded
    padding: 16, // ❌ hardcoded
  },
});
```

### Adding a new token

If you need a value that does not exist in `tokens.ts`:

1. Add it to the correct group in `tokens.ts` with a descriptive name.
2. Commit the token addition separately from the component that uses it (or in the same PR, clearly noted).
3. Never add a one-off value directly in a component file.

---

## Component Rules

### The two-tier component system

**Tier 1 — `src/components/ui/`**
Primitive, single-purpose components that implement the design system directly. They have no knowledge of the app's domain, API, or navigation. They only accept props — no hooks, no API calls inside them.

Current UI primitives: `Button`, `Badge`, `Chip`, `Card`, `Input`.

Rules for UI components:

- Accept a `style` prop (typed as `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`) so callers can extend layout without forking the component.
- Never hardcode domain-specific labels or data.
- All style values from tokens. No exceptions.
- Always export from `src/components/ui/index.ts` barrel.

**Tier 2 — `src/components/shared/`**
Composed components that combine UI primitives and are reused across two or more screens. These may use hooks for local state (e.g. toggle, scroll position) but must not make API calls or use TanStack Query directly — that stays in the screen or a dedicated hook.

Examples of what belongs here: `TaskCard`, `GuestRow`, `AuditEventCard`, `SyncStatusBanner`, `FilterSheet`, `SectionHeader`, `EmptyState`, `LoadingSpinner`.

### The reuse decision rule

Ask these questions before creating a new component file:

```
Is this component used in only one screen?
  YES → put it in src/screens/{screen}/components/{ComponentName}.tsx
  NO  → put it in src/components/shared/{ComponentName}.tsx

Is this component a raw UI primitive (button, input, badge)?
  YES → put it in src/components/ui/{ComponentName}.tsx
```

**If a component starts in a screen folder and later gets used in a second screen, move it to `src/components/shared/` immediately.** Do not duplicate it.

### Component file structure

Every component file follows this order:

```typescript
// 1. React and React Native imports
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// 2. Third-party imports
import { Feather } from '@expo/vector-icons';

// 3. Internal imports — tokens first, then components, then types
import tokens from '@/theme/tokens';
import { Badge } from '@/components/ui';
import type { AuditEvent } from '@/types/audit';

// 4. Props interface — always explicit, never inlined
interface AuditEventCardProps {
  event: AuditEvent;
  onPress: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

// 5. Component — named function, not arrow function at top level
export default function AuditEventCard({ event, onPress, style }: AuditEventCardProps) {
  // local state / derived values
  // ...
  return (
    // JSX
  );
}

// 6. Styles — always last, always StyleSheet.create
const styles = StyleSheet.create({
  // all values from tokens
});
```

### Forbidden patterns

```typescript
// ❌ Inline style objects
<View style={{ padding: 16, backgroundColor: '#fff' }}>

// ❌ Hardcoded values in StyleSheet
const styles = StyleSheet.create({
  box: { padding: 16, color: '#666' }
});

// ❌ Component defined as top-level arrow function (breaks Fast Refresh)
const MyComponent = () => <View />;
export default MyComponent;

// ❌ API call inside a component
export default function TaskCard() {
  const response = await apiClient.get('/tasks'); // NO
}

// ❌ Duplicating a component that already exists
// If GuestRow already exists in shared/, don't create another one in loyalty/

// ❌ Direct apiClient import in a screen or hook
import apiClient from '@/api/client'; // only allowed in src/api/endpoints/
```

---

## API & Data Layer Rules

### Endpoint modules

Every API domain has one file in `src/api/endpoints/`. The file exports typed async functions. It never exports classes, never manages state, never touches the query cache.

```typescript
// src/api/endpoints/auditApi.ts
import apiClient from '../client';
import type { AuditEvent, AuditEventsResponse, AuditFilters } from '@/types/audit';

export const getAuditEvents = (filters: AuditFilters): Promise<AuditEventsResponse> =>
  apiClient.get('/audit/events', { params: filters }).then((r) => r.data);
```

Always return the unwrapped data (`.then(r => r.data)`), never the raw `AxiosResponse`.

### TanStack Query hooks

Every domain has a hooks folder under `src/hooks/{domain}/`. Hooks own the query keys for their domain.

```typescript
// src/hooks/audit/useAuditEvents.ts
import { useQuery } from '@tanstack/react-query';
import { getAuditEvents } from '@/api/endpoints/auditApi';
import type { AuditFilters } from '@/types/audit';

export const auditKeys = {
  all: ['audit'] as const,
  events: (filters: AuditFilters) => [...auditKeys.all, 'events', filters] as const,
};

export function useAuditEvents(filters: AuditFilters) {
  return useQuery({
    queryKey: auditKeys.events(filters),
    queryFn: () => getAuditEvents(filters),
  });
}
```

Rules:

- Query key arrays are defined in the hook file, not the endpoint file.
- `useQuery` and `useMutation` only inside `src/hooks/`. Never directly in a screen.
- For mutations: write-through the detail cache first (`setQueryData`), then `invalidateQueries`.

### Auth store access

The Zustand auth store must be usable both as a React hook and as a direct store reference (for the Axios interceptor, which cannot call hooks).

```typescript
// Inside a component or hook — use the hook
const { user, isAuthenticated } = useAuthStore();

// Inside Axios interceptor or non-React code — use getState()
import { authStore } from '@/store/authStore';
const token = authStore.getState().accessToken;
```

Export both: `export const useAuthStore = create(...)` and `export const authStore = useAuthStore`.

---

## Navigation Rules

### Module-based tab visibility

The backend's `/auth/me` endpoint returns a `modules` array. The tab navigator renders **only** the tabs in that array. This is enforced in `AppNavigator.tsx`.

```typescript
// The modules array from the API determines which tabs render
// ['dashboard', 'live_status', 'audit_trail'] → only 3 tabs shown
// ['dashboard', 'live_status', 'audit_trail', 'revenue', 'reports',
//  'loyalty', 'notifications', 'user_management'] → all 8 tabs shown
```

Never conditionally hide tabs by rendering them invisible — if a module is not in the array, its `Tab.Screen` is not rendered at all.

### Screen rules

- Screens live in `src/screens/{module-name}/{ScreenName}.tsx`.
- A screen may have a local `components/` subfolder for components used only within that screen.
- Once a component is needed by a second screen, move it to `src/components/shared/`.
- Screens do not contain `StyleSheet` definitions longer than ~20 lines — if the screen is getting visually complex, extract the visual sections into components.

### Navigation typing

All navigation props must be typed using the param lists defined in `src/navigation/types.ts`. Never use untyped `navigation` or `route` props.

```typescript
// CORRECT
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AppTabParamList, 'AuditTrail'>;

export default function AuditTrailScreen({ navigation, route }: Props) { ... }
```

---

## State Management Rules

### What goes where

| State type                                 | Where it lives                             |
| ------------------------------------------ | ------------------------------------------ |
| Server data (API responses)                | TanStack Query (`useQuery`, `useMutation`) |
| Auth (token, user, role, modules)          | Zustand — `src/store/authStore.ts`         |
| Local UI state (open/closed, selected tab) | `useState` inside the component            |
| Shared UI state across sibling components  | Lift to nearest common parent              |
| Persistent non-auth data                   | `AsyncStorage` via a dedicated store       |

Do not create new Zustand stores unless auth-level persistence is genuinely needed. Most state is server state (TanStack Query) or local component state (`useState`).

### Loading and error states

Every screen that fetches data must handle three states explicitly:

```typescript
const { data, isLoading, isError, error } = useAuditEvents(filters);

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
// render data
```

`LoadingSpinner` and `ErrorState` are shared components in `src/components/shared/`. Do not inline loading spinners or error messages in screens.

---

## Typing Rules

### Shared types

Domain types (the shapes of API responses and entities) live in `src/types/`. Name them by domain:

```
src/types/
  auth.ts        # AuthUser, UserRole, UserProperty, ModuleKey
  audit.ts       # AuditEvent, AuditEventType, AuditFilters
  booking.ts     # Booking, BookingStatus
  guest.ts       # Guest, GuestTier, GuestSource
  revenue.ts     # RevenueSummary, RevenuePeriod
  room.ts        # Room, RoomStatus
  notification.ts
```

### API response types

Every API endpoint function must have an explicit return type. No `any`, no implicit `unknown`.

```typescript
// CORRECT
export const getAuditEvents = (filters: AuditFilters): Promise<AuditEventsResponse> => ...

// WRONG
export const getAuditEvents = (filters: any) => ... // ❌
```

### Enums vs union types

Prefer TypeScript union types over enums for values that come from the API:

```typescript
// CORRECT
export type EventType = 'new_booking' | 'extension' | 'early_checkout' | 'cancellation' | 'modification';

// AVOID
enum EventType { NewBooking = 'new_booking', ... } // harder to use with API strings
```

---

## Icons

Use `@expo/vector-icons` — specifically the `Feather` set as the primary icon family. Feather matches the thin stroke weight of the design.

```typescript
import { Feather } from '@expo/vector-icons';

<Feather name="bell" size={20} color={tokens.colors.textPrimary} />
```

If a specific icon does not exist in Feather, fall back to `Ionicons` from the same package. Do not install additional icon libraries.

Icon sizes follow a consistent scale:

- Tab bar icons: 22
- In-content icons (alongside text): 16
- Small inline icons (badges, labels): 13
- Large standalone icons (empty states): 40

---

## Empty States and Error States

Every list screen must handle the empty and error cases with the shared components, not inline text.

```typescript
// src/components/shared/EmptyState.tsx
// Props: icon (Feather icon name), title, subtitle, action (optional button)

// src/components/shared/ErrorState.tsx
// Props: message, onRetry

// Usage
if (data.events.length === 0) {
  return <EmptyState icon="list" title="No events" subtitle="No audit events match your filters." />;
}
```

The empty state copy must be specific and actionable — not generic "Nothing here" text.

---

## Code Style

- **Named exports for types and utilities.** Default export for components and screens.
- **No barrel exports from screens.** Only `src/components/ui/index.ts` and `src/components/shared/index.ts` use barrel exports.
- **File naming:** PascalCase for components and screens (`TaskCard.tsx`), camelCase for hooks (`useAuditEvents.ts`), camelCase for utilities and API files (`auditApi.ts`).
- **No commented-out code** committed to the repo. Use git history.
- **No `console.log`** committed. Use a proper logger utility or remove before committing.
- **Trailing commas** in objects and arrays (enforced by Prettier).
- **Single quotes** for strings (enforced by Prettier).

---

## Before Submitting Any Code

Run these three commands. All must pass with zero errors before the code is considered done:

```bash
pnpm type-check    # tsc --noEmit — zero TypeScript errors
pnpm lint          # eslint — zero warnings (--max-warnings 0)
pnpm format        # prettier --write — auto-formats, then confirm no diff
```

If any check fails, fix the issue. Do not suppress errors with ignore comments.

---

## Common Mistakes to Avoid

| Mistake                                                                        | Correct approach                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Hardcoding `'#000000'` in a StyleSheet                                         | Use `tokens.colors.primary`                                 |
| Hardcoding `padding: 16` in a StyleSheet                                       | Use `tokens.spacing.lg`                                     |
| Importing `apiClient` in a screen                                              | Create an endpoint function in `src/api/endpoints/`         |
| Using `useQuery` directly in a screen                                          | Create a hook in `src/hooks/{domain}/`                      |
| Creating a component inside a screen folder when it's already needed elsewhere | Move to `src/components/shared/`                            |
| Defining a style object inline in JSX                                          | Move to `StyleSheet.create()` at the bottom of the file     |
| Creating a new Zustand store for server data                                   | Use TanStack Query — it already handles loading/error/cache |
| Using `Platform.OS === 'android'`                                              | This is an iOS-only app — remove it                         |
| Adding a token directly in a component                                         | Add to `tokens.ts` first, then import                       |
| Using `AsyncStorage` for auth tokens                                           | Use `expo-secure-store` via `src/api/storage.ts`            |

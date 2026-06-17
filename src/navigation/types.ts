import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ModuleKey } from '@/types/auth';

// ─── Auth Stack ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

// ─── App Tabs ────────────────────────────────────────────────────────────────

export type AppTabParamList = {
  Dashboard: undefined;
  LiveStatus: undefined;
  AuditTrail: undefined;
  Revenue: undefined;
  // Reports: undefined;
  // Loyalty: undefined;
  // Notifications: undefined;
  UserManagement: undefined;
};

/** Maps each backend ModuleKey to the corresponding tab route name. */
export const MODULE_TO_TAB: Record<ModuleKey, keyof AppTabParamList> = {
  dashboard: 'Dashboard',
  live_status: 'LiveStatus',
  audit_trail: 'AuditTrail',
  revenue: 'Revenue',
  // reports: 'Reports',
  // loyalty: 'Loyalty',
  // notifications: 'Notifications',
  user_management: 'UserManagement',
};

// ─── Root Stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  DevMenu: undefined;
  DesignSystemPreview: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ReportType } from '@/types/reports';

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
  Operations: undefined;
  Guests: undefined;
  Campaigns: undefined;
  Menu: NavigatorScreenParams<MenuStackParamList> | undefined;
};

// ─── Operations Stack ────────────────────────────────────────────────────────

export type OperationsStackParamList = {
  OperationsHome: undefined;
};

// ─── Menu Stack ─────────────────────────────────────────────────────────────

export type MenuStackParamList = {
  MenuHome: undefined;
  RevenueAnalytics: undefined;
  UserManagement: undefined;
  LoyaltyConfiguration: undefined;
  Expenses: undefined;
  Reports: undefined;
  // `from` is the day, the week's Monday, or the 1st of the month; the end is derived from it.
  ReportScorecard: { type: ReportType; from: string };
};

// ─── Root Stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<AppTabParamList> | undefined;
  CampaignDetails: { id: string };
  AutomationRunHistory: { id: string; name: string };
  GuestProfile: { id: string };
  // eventId is optional so this screen still works when reached normally (not via a
  // notification deep link) — undefined means "just show the list, nothing to highlight."
  AuditTrail: { eventId?: string } | undefined;

  DesignSystemPreview: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

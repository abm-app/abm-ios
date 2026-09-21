import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  Menu: undefined;
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
};

// ─── Root Stack ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CampaignDetails: { id: string };
  AutomationRunHistory: { id: string; name: string };
  GuestProfile: { id: string };
  ReportViewer: { date: string };
  // eventId is optional so this screen still works when reached normally (not via a
  // notification deep link) — undefined means "just show the list, nothing to highlight."
  AuditTrail: { eventId?: string } | undefined;

  DesignSystemPreview: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

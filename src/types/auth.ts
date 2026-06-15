// ─── Roles ───────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'front_desk' | 'housekeeping' | 'accountant';

// ─── Modules ─────────────────────────────────────────────────────────────────

export type ModuleKey =
  | 'dashboard'
  | 'live_status'
  | 'audit_trail'
  | 'revenue'
  | 'reports'
  | 'loyalty'
  | 'notifications'
  | 'user_management';

// ─── Property ────────────────────────────────────────────────────────────────

export interface UserProperty {
  id: string;
  name: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  property: UserProperty;
  modules: ModuleKey[];
}

// ─── Auth API payloads & responses ───────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}

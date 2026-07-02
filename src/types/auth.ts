// ─── Roles ───────────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'manager' | 'staff';

// ─── Properties ──────────────────────────────────────────────────────────────

export type UserProperty = 'express' | 'international' | 'both';

// ─── Modules ─────────────────────────────────────────────────────────────────
// Single source of truth — navigation imports ModuleKey from here.

export type ModuleKey =
  // | 'dashboard'
  'campaigns' | 'live_status' | 'audit_trail' | 'revenue' | 'user_management' | 'loyalty';
// | 'reports'
// | 'notifications';

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  modules: ModuleKey[];
}

import apiClient from '../client';
import type { AuthUser, LoginRequest, LoginResponse, ModuleKey } from '@/types/auth';
import { USE_MOCK_AUTH } from '@/config/env';

// ─── Mock toggle ─────────────────────────────────────────────────────────────

// ─── Mock delay helper ───────────────────────────────────────────────────────

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// ─── Module sets per role ────────────────────────────────────────────────────

const ALL_MODULES: ModuleKey[] = [
  'dashboard',
  'live_status',
  'audit_trail',
  'revenue',
  'reports',
  'loyalty',
  'notifications',
  'user_management',
];

const MANAGER_MODULES: ModuleKey[] = ALL_MODULES.filter(m => m !== 'user_management');

const STAFF_MODULES: ModuleKey[] = ['dashboard', 'live_status', 'notifications'];

// ─── Mock users ──────────────────────────────────────────────────────────────

interface MockUser {
  password: string;
  user: AuthUser;
  modules: ModuleKey[];
}

const MOCK_USERS: Record<string, MockUser> = {
  'owner@abm.com': {
    password: 'owner123',
    modules: ALL_MODULES,
    user: {
      id: 'usr_001',
      email: 'owner@abm.com',
      firstName: 'Raj',
      lastName: 'Mehta',
      role: 'owner',
      property: 'both',
      modules: ALL_MODULES,
    },
  },
  'manager@abm.com': {
    password: 'manager123',
    modules: MANAGER_MODULES,
    user: {
      id: 'usr_002',
      email: 'manager@abm.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      role: 'manager',
      property: 'express',
      modules: MANAGER_MODULES,
    },
  },
  'staff@abm.com': {
    password: 'staff123',
    modules: STAFF_MODULES,
    user: {
      id: 'usr_003',
      email: 'staff@abm.com',
      firstName: 'Amit',
      lastName: 'Kumar',
      role: 'staff',
      property: 'international',
      modules: STAFF_MODULES,
    },
  },
};

// ─── Mock login ──────────────────────────────────────────────────────────────

async function mockLogin(payload: LoginRequest): Promise<LoginResponse> {
  await delay(800);

  const email = payload.email.trim().toLowerCase();
  const mock = MOCK_USERS[email];

  if (!mock || mock.password !== payload.password) {
    throw new Error('Invalid email or password');
  }

  return {
    accessToken: `mock_access_${mock.user.id}`,
    refreshToken: `mock_refresh_${mock.user.id}`,
    user: mock.user,
    modules: mock.modules,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  if (USE_MOCK_AUTH) {
    return mockLogin(payload);
  }
  const r = await apiClient.post('/auth/login', payload);
  return r.data;
};

export const logout = async (): Promise<void> => {
  if (USE_MOCK_AUTH) {
    return Promise.resolve(undefined);
  }
  await apiClient.post('/auth/logout');
  return undefined;
};

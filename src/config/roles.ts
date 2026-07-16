export const ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const TAB_PERMISSIONS = {
  Dashboard: [ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF],
  Operations: [ROLES.OWNER, ROLES.MANAGER], // Staff excluded from Operations tab
  Guests: [ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF], // Staff view-only (handled in components/backend)
  Campaigns: [ROLES.OWNER, ROLES.MANAGER], // Staff excluded
  Admin: [ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF], // Staff can access to use logout
} as const;

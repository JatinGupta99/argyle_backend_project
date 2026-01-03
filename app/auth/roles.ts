export const ROLES = {
  MODERATOR: "Moderator",
  SPEAKER: "Speaker",
  ATTENDEE: "Attendee",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Granular permissions for professional RBAC
 */
export type Permission =
  | 'event:view'
  | 'event:edit'
  | 'event:manage'
  | 'post:create'
  | 'post:delete'
  | 'post:edit'
  | 'chat:backstage'
  | 'broadcast:start';

/**
 * Role to Permission mapping
 * Single source of truth for capabilities
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.MODERATOR]: [
    'event:view',
    'event:edit',
    'event:manage',
    'post:create',
    'post:delete',
    'post:edit',
    'chat:backstage',
    'broadcast:start',
  ],
  [ROLES.SPEAKER]: [
    'event:view',
    'chat:backstage',
  ],
  [ROLES.ATTENDEE]: [
    'event:view',
  ],
};

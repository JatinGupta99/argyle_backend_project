export enum ROLES_ADMIN {
  Moderator = 'Moderator',
  Speaker = 'Speaker',
  Attendee = 'Attendee',
}

export type Role = ROLES_ADMIN;

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
export const ROLE_PERMISSIONS: Record<ROLES_ADMIN, Permission[]> = {
  [ROLES_ADMIN.Moderator]: [
    'event:view',
    'event:edit',
    'event:manage',
    'post:create',
    'post:delete',
    'post:edit',
    'chat:backstage',
    'broadcast:start',
  ],
  [ROLES_ADMIN.Speaker]: [
    'event:view',
    'chat:backstage',
  ],
  [ROLES_ADMIN.Attendee]: [
    'event:view',
  ],
};

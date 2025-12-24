import { ROLE_CONFIG } from "./role-config";
import { Role, ROLES } from "./roles";

type Media = "audio" | "video" | "screenVideo" | "screenAudio";

export const getRoleConfig = (role: Role) =>
  ROLE_CONFIG[role];

export const canAdmin = (role: Role) =>
  ROLE_CONFIG[role].permissions.canAdmin;

export const canSendMedia = (
  role: Role,
  media: Media
) => {
  const canSend = ROLE_CONFIG[role].permissions.canSend;

  if (canSend === true) return true;
  if (canSend === false) return false;

  return canSend.includes(media);
};

export const normalizeRole = (r?: string | Role): Role => {
  if (!r) return ROLES.ATTENDEE;

  const vals = Object.values(ROLES) as string[];
  if (vals.includes(r as string)) return r as Role;

  const lower = String(r).toLowerCase();
  if (lower === 'moderator') return ROLES.MODERATOR;
  if (lower === 'speaker') return ROLES.SPEAKER;
  return ROLES.ATTENDEE;
};

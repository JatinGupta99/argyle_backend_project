export const ROLES = {
  MODERATOR: "Moderator",
  SPEAKER: "Speaker",
  ATTENDEE: "Attendee",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

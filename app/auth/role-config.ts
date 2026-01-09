import { Role, ROLES } from "./roles";

type Media = "audio" | "video" | "screenVideo" | "screenAudio";

type Permissions = {
  hasPresence: boolean;
  canSend: boolean | Media[];
  canAdmin: boolean;
};

export type RoleConfig = {
  is_owner: boolean;
  enable_screenshare: boolean;
  enable_prejoin_ui: boolean;
  start_video_off: boolean;
  start_audio_off: boolean;
  enable_recording?: "cloud" | "local";
  permissions: Permissions;
};

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  [ROLES.MODERATOR]: {
    is_owner: true,
    enable_screenshare: true,
    enable_prejoin_ui: false,
    start_video_off: true,
    start_audio_off: false,
    enable_recording: 'cloud',
    permissions: {
      hasPresence: true,
      canSend: ["audio", "screenVideo", "screenAudio"],
      canAdmin: true,
    },
  },

  [ROLES.SPEAKER]: {
    is_owner: false,
    enable_screenshare: true,
    enable_prejoin_ui: false,
    start_video_off: false,
    start_audio_off: false,
    permissions: {
      hasPresence: true,
      canSend: ["audio", "video", "screenVideo", "screenAudio"],
      canAdmin: false,
    },
  },

  [ROLES.ATTENDEE]: {
    is_owner: false,
    enable_screenshare: false,
    enable_prejoin_ui: true,
    start_video_off: true,
    start_audio_off: true,
    permissions: {
      hasPresence: true,
      canSend: false,
      canAdmin: false,
    },
  },
};

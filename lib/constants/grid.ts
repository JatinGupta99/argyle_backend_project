export const GRID_CONFIG = {
  /** Maximum number of videos shown per page */
  VIDEOS_PER_PAGE: 6,

  /** Debounce delay (ms) for scroll pagination */
  SCROLL_DEBOUNCE_MS: 400,

  /** Optional: Minimum tile size in pixels (for responsive layout logic) */
  MIN_TILE_SIZE_PX: 220,

  /** Optional: Default grid gap (used by some layouts) */
  GRID_GAP_PX: 16,
} as const;

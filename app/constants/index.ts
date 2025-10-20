export const DEFAULT_LIST_NAME = 'New Packing List';

export const TEMPLATES = {
  WEEKEND: 'weekend-trip',
  BEACH: 'beach-holiday',
  SKIING: 'skiing-trip',
} as const;

export const ERROR_MESSAGES = {
  INVALID_STATE: 'Invalid list state in URL',
  FAILED_SAVE: 'Failed to save list',
  FAILED_SHARE: 'Failed to copy share link',
} as const;
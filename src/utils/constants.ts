
export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  REDIRECT_DELAY: 1000,
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

export const API_CONSTANTS = {
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000,
} as const;

/**
 * Timer Constants
 * Chunks of time & Lombardi punctuality parameters
 */

export const TIMER_CONFIG = {
  DEFAULT_CHUNK_MINUTES: 90,
  DEFAULT_CHUNK_SECONDS: 90 * 60,
  SHORT_CHUNK_MINUTES: 60,
  SHORT_CHUNK_SECONDS: 60 * 60,
  LOMBARDI_TIME_MINUTES: 15,
  LOMBARDI_TIME_SECONDS: 15 * 60,
  TICK_INTERVAL_MS: 1000,
} as const;

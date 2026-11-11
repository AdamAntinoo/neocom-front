/** Programme log levels (CICD-F-118). `NONE` is configuration-only. */
export type LogLevel = 'DEBUG' | 'INFO' | 'PRODUCTION' | 'NONE';

/** Stable section identifiers for front programme logs (CICD-F-115). */
export type LogSection =
  | 'app'
  | 'auth'
  | 'pilot'
  | 'industry'
  | 'assets'
  | 'http'
  | 'sse'
  | 'universe';

export const LOG_LEVEL_RANK: Record<Exclude<LogLevel, 'NONE'>, number> = {
  DEBUG: 10,
  INFO: 20,
  PRODUCTION: 30,
};

export interface LoggingConfig {
  /** Default floor when a section is unset. Production defaults to NONE (CICD-F-120). */
  defaultLevel: LogLevel;
  /** Per-section configured level (including NONE). */
  sections: Partial<Record<LogSection, LogLevel>>;
}

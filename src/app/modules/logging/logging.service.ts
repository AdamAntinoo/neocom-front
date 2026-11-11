import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  LOG_LEVEL_RANK,
  type LogLevel,
  type LogSection,
  type LoggingConfig,
} from './logging.types';

export const LOGGING_CONFIG = new InjectionToken<LoggingConfig>('LOGGING_CONFIG');

/**
 * Front programme logging provider (CICD-F-110…122, F-124).
 * Call sites pass level + section + message; filtering is config-driven.
 * Emits to the browser console only — not required on the Node server (F-124).
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly config: LoggingConfig;

  constructor(@Optional() @Inject(LOGGING_CONFIG) config: LoggingConfig | null) {
    this.config = config ?? environment.logging;
  }

  debug(section: LogSection, message: string, ...params: unknown[]): void {
    this.emit('DEBUG', section, message, params);
  }

  info(section: LogSection, message: string, ...params: unknown[]): void {
    this.emit('INFO', section, message, params);
  }

  production(section: LogSection, message: string, ...params: unknown[]): void {
    this.emit('PRODUCTION', section, message, params);
  }

  log(
    level: Exclude<LogLevel, 'NONE'>,
    section: LogSection,
    message: string,
    ...params: unknown[]
  ): void {
    this.emit(level, section, message, params);
  }

  private emit(
    level: Exclude<LogLevel, 'NONE'>,
    section: LogSection,
    message: string,
    params: unknown[],
  ): void {
    if (!this.isAllowed(level, section)) {
      return;
    }
    const rendered = this.renderMessage(message, params);
    const line = { level, section, message: rendered };
    switch (level) {
      case 'DEBUG':
        console.debug(line);
        break;
      case 'INFO':
        console.info(line);
        break;
      case 'PRODUCTION':
        console.log(line);
        break;
    }
  }

  private isAllowed(level: Exclude<LogLevel, 'NONE'>, section: LogSection): boolean {
    if (level === 'PRODUCTION') {
      return true;
    }
    const configured = this.sectionLevel(section);
    if (configured === 'NONE') {
      return false;
    }
    return LOG_LEVEL_RANK[level] >= LOG_LEVEL_RANK[configured];
  }

  private sectionLevel(section: LogSection): LogLevel {
    return this.config.sections[section] ?? this.config.defaultLevel;
  }

  private renderMessage(message: string, params: unknown[]): string {
    if (params.length === 0) {
      return message;
    }
    let i = 0;
    return message.replace(/\{(\d*)\}/g, (_match, index: string) => {
      const idx = index === '' ? i++ : Number(index);
      if (idx >= params.length || Number.isNaN(idx)) {
        return '{}';
      }
      if (index !== '') {
        i = Math.max(i, idx + 1);
      }
      try {
        return JSON.stringify(params[idx]);
      } catch {
        return String(params[idx]);
      }
    });
  }
}

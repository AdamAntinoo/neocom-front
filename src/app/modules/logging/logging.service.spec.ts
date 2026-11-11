import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LOGGING_CONFIG, LoggingService } from './logging.service';
import type { LoggingConfig } from './logging.types';

const testConfig: LoggingConfig = {
  defaultLevel: 'DEBUG',
  sections: {
    app: 'INFO',
    auth: 'NONE',
  },
};

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOGGING_CONFIG, useValue: testConfig }, LoggingService],
    });
    service = TestBed.inject(LoggingService);
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('emits INFO when section allows INFO', () => {
    service.info('app', 'hello {0}', { id: 1 });
    expect(console.info).toHaveBeenCalledWith({
      level: 'INFO',
      section: 'app',
      message: 'hello {"id":1}',
    });
  });

  it('suppresses DEBUG when section floor is INFO', () => {
    service.debug('app', 'noisy');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('suppresses INFO when section is NONE', () => {
    service.info('auth', 'secret');
    expect(console.info).not.toHaveBeenCalled();
  });

  it('emits PRODUCTION when section allows it', () => {
    service.production('app', 'signal');
    expect(console.log).toHaveBeenCalledWith({
      level: 'PRODUCTION',
      section: 'app',
      message: 'signal',
    });
  });

  it('still emits PRODUCTION when section is NONE', () => {
    service.production('auth', 'signal');
    expect(console.log).toHaveBeenCalledWith({
      level: 'PRODUCTION',
      section: 'auth',
      message: 'signal',
    });
  });
});

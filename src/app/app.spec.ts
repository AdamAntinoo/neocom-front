import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { PilotService } from './modules/services/pilot.service';
import { App } from './app';
import { routes } from './app.routes';
import { NEOCOM_ACCESS, deleteCookie, writeCookie } from './security/cookie.util';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: PilotService, useValue: { getPilot: () => of({ pilotId: 93813310, name: 'Perico Tuerto' }) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});

describe('Application start route', () => {
  beforeEach(() => {
    deleteCookie(NEOCOM_ACCESS);
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: PilotService, useValue: { getPilot: () => of({ pilotId: 93813310, name: 'Perico Tuerto' }) } },
      ],
    });
  });

  afterEach(() => {
    deleteCookie(NEOCOM_ACCESS);
  });

  it('should redirect to login when the access cookie is missing', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('[cy-name="EVE-login-button"]')).toBeTruthy();
  });

  it('should land on the dashboard home page when the access cookie is present', async () => {
    writeCookie(NEOCOM_ACCESS, 'token|Perico Tuerto|93813310');
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('[cy-section-name="header"]')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('app-info-panel')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('server-info-panel')).toBeTruthy();
    expect(harness.routeNativeElement?.querySelector('[cy-section-name="pilot-dashboard"]')).toBeTruthy();
  });
});

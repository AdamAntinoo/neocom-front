import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../modules/services/auth.service';
import { LoginCallbackPageComponent } from './login-callback-page.component';

@Component({ template: '' })
class DashboardStubComponent {}

describe('LoginCallbackPageComponent', () => {
  function setup(
    query: Record<string, string>,
    cookie?: string,
    authImpl?: Partial<AuthService>,
  ): ComponentFixture<LoginCallbackPageComponent> {
    document.cookie = 'neocom_sso_state=; Max-Age=0; Path=/';
    if (cookie) {
      document.cookie = `neocom_sso_state=${cookie}; Path=/`;
    }

    TestBed.configureTestingModule({
      imports: [LoginCallbackPageComponent],
      providers: [
        provideRouter([{ path: 'dashboard', component: DashboardStubComponent }]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap(query)) },
        },
        {
          provide: AuthService,
          useValue: {
            exchangeCode: () => of({ characterId: 1, characterName: 'Test' }),
            ...authImpl,
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(LoginCallbackPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => {
    document.cookie = 'neocom_sso_state=; Max-Age=0; Path=/';
    TestBed.resetTestingModule();
  });

  it('should create the callback page', () => {
    const fixture = setup({});
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the app info panel and wait for the authorization code', () => {
    const fixture = setup({});
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#appinfo-panel')).toBeTruthy();
    expect(root.querySelector('[cy-field-value="progress-label"]')?.textContent).toContain(
      'Waiting for code authentication...',
    );
    expect(root.querySelector('[cy-field-value="progress-code"]')?.textContent).toContain('-AWAITING-CODE-');
    expect(root.querySelector('[cy-field-value="exceptionMessage"]')?.textContent).toContain(
      'The request does not have a mandatory query parameter.',
    );
  });

  it('should reject a state that does not match the cookie', () => {
    const fixture = setup({ code: 'auth-code', state: 'other' }, 'expected-state');
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-field-value="progress-code"]')?.textContent).toContain('auth-code');
    expect(root.querySelector('[cy-field-value="exceptionMessage"]')?.textContent).toContain(
      'The request state does not match. Caller not verified.',
    );
  });

  it('should accept a code whose state matches the cookie', () => {
    const fixture = setup({ code: 'auth-code', state: 'expected-state' }, 'expected-state');
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-field-value="progress-code"]')?.textContent).toContain('auth-code');
    expect(root.querySelector('[cy-section-name="exception"]')).toBeNull();
  });

  it('should show an exception when the code exchange fails', () => {
    const fixture = setup({ code: 'auth-code', state: 'expected-state' }, 'expected-state', {
      exchangeCode: () => throwError(() => new Error('exchange failed')),
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-field-value="exceptionMessage"]')?.textContent).toContain(
      'The authorization code could not be exchanged.',
    );
  });

  it('should show a backend-unavailable message when the proxy returns 502', () => {
    const fixture = setup({ code: 'auth-code', state: 'expected-state' }, 'expected-state', {
      exchangeCode: () =>
        throwError(() => new HttpErrorResponse({ status: 502, statusText: 'Bad Gateway' })),
    });
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[cy-field-value="exceptionMessage"]')?.textContent).toContain(
      'The backend is not available',
    );
  });
});


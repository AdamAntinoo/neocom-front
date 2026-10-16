import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../modules/services/auth.service';
import { AppInfoPanelComponent } from '../../panels/app-info-panel/app-info-panel.component';
import { NEOCOM_SSO_STATE, readCookie } from '../../security/cookie.util';
import { SessionService } from '../../security/session.service';

/**
 * Callback page for the EVE SSO redirect (LOGIN-008).
 *
 * When login is complete, EVE SSO returns the browser to `/login-callback`
 * with `code` and `state`. This page is required to finish that login.
 */
@Component({
  selector: 'login-callback-page',
  imports: [AppInfoPanelComponent],
  templateUrl: './login-callback-page.component.html',
  styleUrl: './login-callback-page.component.scss',
})
export class LoginCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);

  protected readonly code = signal<string | null>(null);
  protected readonly exception = signal<{ title: string; message: string } | null>(null);
  private exchangeStarted = false;

  protected readonly codeLabel = computed(() => {
    const value = this.code();
    if (value == null || value === '') {
      return '-AWAITING-CODE-';
    }
    return value;
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      this.code.set(code);
      const validationError = this.validate(code, params.get('state'));
      this.exception.set(validationError);
      if (validationError == null && code != null && !this.exchangeStarted) {
        this.exchangeStarted = true;
        const state = params.get('state')!;
        const returnUrl = this.session.getReturnUrl() ?? '/dashboard';
        this.auth.exchangeCode(code, state).subscribe({
          next: () => {
            void this.router.navigateByUrl(returnUrl);
          },
          error: (err: unknown) => {
            this.exception.set(this.mapExchangeError(err));
          },
        });
      }
    });
  }

  private mapExchangeError(err: unknown): { title: string; message: string } {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0 || err.status === 502 || err.status === 503 || err.status === 504) {
        return {
          title: 'EXCEPTION',
          message: 'The backend is not available. Start neocom-back and try login again.',
        };
      }
      return {
        title: 'EXCEPTION',
        message: `The authorization code could not be exchanged (HTTP ${err.status}).`,
      };
    }
    return {
      title: 'EXCEPTION',
      message: 'The authorization code could not be exchanged.',
    };
  }

  private validate(code: string | null, state: string | null): { title: string; message: string } | null {
    if (code == null || code === '') {
      return {
        title: 'EXCEPTION',
        message: 'The request does not have a mandatory query parameter.',
      };
    }
    if (state == null || state === '' || state !== readCookie(NEOCOM_SSO_STATE)) {
      return {
        title: 'EXCEPTION',
        message: 'The request state does not match. Caller not verified.',
      };
    }
    return null;
  }
}

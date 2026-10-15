import { Component, inject, OnInit } from '@angular/core';
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

  protected code: string | null = null;
  protected exception: { title: string; message: string } | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.code = params.get('code');
      this.exception = this.validate(this.code, params.get('state'));
      if (this.exception == null && this.code != null) {
        const state = params.get('state')!;
        const returnUrl = this.session.getReturnUrl() ?? '/dashboard';
        this.auth.exchangeCode(this.code, state).subscribe({
          next: () => {
            void this.router.navigateByUrl(returnUrl);
          },
          error: () => {
            this.exception = {
              title: 'EXCEPTION',
              message: 'The authorization code could not be exchanged.',
            };
          },
        });
      }
    });
  }

  protected get codeLabel(): string {
    if (this.code == null || this.code === '') {
      return '-AWAITING-CODE-';
    }
    return this.code;
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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../modules/services/auth.service';
import { HeaderModule } from '../../modules/header/header.module';
import { NeoComVariant } from '../../modules/innovative-core/domain/NeoComVariant';
import { LoginValidationExceptionComponent } from '../../panels/login-validation-exception/login-validation-exception.component';
import { LoginValidationProgressComponent } from '../../panels/login-validation-progress/login-validation-progress.component';
import { NEOCOM_SSO_STATE, readCookie } from '../../security/cookie.util';
import { rememberStoredCharacter } from '../../security/stored-characters';
import { SessionService } from '../../security/session.service';

/**
 * Callback page for the EVE SSO redirect (LOGIN-008).
 *
 * When login is complete, EVE SSO returns the browser to `/login-callback`
 * with `code` and `state`. This page is required to finish that login.
 */
@Component({
  selector: 'login-callback-page',
  imports: [HeaderModule, LoginValidationProgressComponent, LoginValidationExceptionComponent],
  templateUrl: './login-callback-page.component.html',
  styleUrl: './login-callback-page.component.scss',
  host: { class: 'neo-page' },
})
export class LoginCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);

  protected readonly Variant = NeoComVariant;

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
    // Safety net: state cookie may live on the sibling loopback host (localhost ↔ 127.0.0.1).
    if (readCookie(NEOCOM_SSO_STATE) == null) {
      const sibling = swapLoopbackHost(window.location.href);
      if (sibling != null && !sessionStorage.getItem('neocom_sso_host_swap')) {
        sessionStorage.setItem('neocom_sso_host_swap', '1');
        window.location.replace(sibling);
        return;
      }
    }
    sessionStorage.removeItem('neocom_sso_host_swap');
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      this.code.set(code);
      const validationError = this.validate(code, params.get('state'));
      this.exception.set(validationError);
      if (validationError == null && code != null && !this.exchangeStarted) {
        this.exchangeStarted = true;
        const state = params.get('state')!;
        this.auth.exchangeCode(code, state).subscribe({
          next: () => {
            const access = this.session.getAccess();
            if (access) {
              rememberStoredCharacter({
                characterId: access.characterId,
                characterName: access.characterName,
              });
            }
            // UI-CHAR-002 — character selection precedes Dashboard after SSO.
            void this.router.navigateByUrl('/character-selection');
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

  private validate(
    code: string | null,
    state: string | null,
  ): { title: string; message: string } | null {
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

/** Flip localhost ↔ 127.0.0.1 keeping path and query (SSO cookie recovery). */
function swapLoopbackHost(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1';
      return url.toString();
    }
    if (url.hostname === '127.0.0.1') {
      url.hostname = 'localhost';
      return url.toString();
    }
    return null;
  } catch {
    return null;
  }
}

import { Directive } from '@angular/core';
import { environment } from '../../environments/environment';
import { SessionService } from '../security/session.service';

/**
 * Builds the EVE SSO authorize URL from `environment.loginLinkData` (LOGIN-003).
 * Ported from the infinity `OAuthEnabledComponent` / `BackgroundOauthEnabledComponent` pattern.
 */
@Directive()
export class OAuthEnabledComponent {
  private lastState = '';

  constructor(protected readonly session: SessionService) {}

  getLoginLink(): string {
    return this.composeLoginLink();
  }

  getLastState(): string {
    return this.lastState;
  }

  protected composeLoginLink(): string {
    const data = environment.loginLinkData;
    this.lastState = createSsoState();
    this.session.setSsoState(this.lastState);
    const params = new URLSearchParams({
      response_type: data.responseType,
      client_id: data.clientId,
      state: this.lastState,
      redirect_uri: data.redirectUri,
      scope: data.scope,
    });
    const base = data.authorizeHost.endsWith('?') || data.authorizeHost.endsWith('/')
      ? data.authorizeHost.replace(/\?$/, '')
      : data.authorizeHost;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}${params.toString()}`;
  }
}

@Directive()
export class BackgroundOauthEnabledComponent extends OAuthEnabledComponent {}

function createSsoState(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

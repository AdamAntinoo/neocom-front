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
      // Must match the EVE-registered redirect URI exactly (hostname included).
      redirect_uri: data.redirectUri,
      scope: data.scope,
    });
    const base =
      data.authorizeHost.endsWith('?') || data.authorizeHost.endsWith('/')
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

/**
 * SSO state cookie is host-bound. If the app is opened on 127.0.0.1 while
 * redirect_uri uses localhost (or the reverse), return the same path on the
 * redirect_uri host so login can continue with a matching cookie.
 */
export function loopbackHostCorrectionUrl(
  configuredRedirectUri: string,
  currentHref: string = typeof window !== 'undefined' ? window.location.href : '',
): string | null {
  if (!currentHref) {
    return null;
  }
  try {
    const configured = new URL(configuredRedirectUri);
    const current = new URL(currentHref);
    const loopbackPair =
      (configured.hostname === 'localhost' || configured.hostname === '127.0.0.1') &&
      (current.hostname === 'localhost' || current.hostname === '127.0.0.1');
    if (!loopbackPair || configured.hostname === current.hostname) {
      return null;
    }
    current.hostname = configured.hostname;
    if (configured.port) {
      current.port = configured.port;
    }
    return current.toString();
  } catch {
    return null;
  }
}

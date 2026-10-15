import { Injectable } from '@angular/core';
import {
  deleteCookie,
  NEOCOM_ACCESS,
  NEOCOM_RETURN,
  NEOCOM_SSO_STATE,
  readCookie,
  writeCookie,
} from './cookie.util';

export interface AccessSession {
  accessToken: string;
  characterName: string;
  characterId: number;
}

/** Readable `neocom_access` value: accessToken|characterName|characterId */
export function formatAccessCookie(session: AccessSession): string {
  return `${session.accessToken}|${session.characterName}|${session.characterId}`;
}

export function parseAccessCookie(raw: string | null): AccessSession | null {
  if (raw == null || raw === '') {
    return null;
  }
  const parts = raw.split('|');
  if (parts.length < 3) {
    return null;
  }
  const characterId = Number(parts[parts.length - 1]);
  const characterName = parts[parts.length - 2];
  const accessToken = parts.slice(0, parts.length - 2).join('|');
  if (!Number.isFinite(characterId) || characterName === '' || accessToken === '') {
    return null;
  }
  return { accessToken, characterName, characterId };
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  hasAccess(): boolean {
    return parseAccessCookie(readCookie(NEOCOM_ACCESS)) != null;
  }

  getAccess(): AccessSession | null {
    return parseAccessCookie(readCookie(NEOCOM_ACCESS));
  }

  /** LOGIN-006 — switch active character without a new SSO login. */
  selectStoredCharacter(characterName: string, characterId: number): void {
    const current = this.getAccess();
    const accessToken = current?.accessToken ?? '';
    writeCookie(NEOCOM_ACCESS, formatAccessCookie({ accessToken, characterName, characterId }));
  }

  clearAccess(): void {
    deleteCookie(NEOCOM_ACCESS);
  }

  setReturnUrl(url: string): void {
    writeCookie(NEOCOM_RETURN, url);
  }

  getReturnUrl(): string | null {
    return readCookie(NEOCOM_RETURN);
  }

  setSsoState(state: string): void {
    writeCookie(NEOCOM_SSO_STATE, state);
  }

  getSsoState(): string | null {
    return readCookie(NEOCOM_SSO_STATE);
  }

  clearSsoState(): void {
    deleteCookie(NEOCOM_SSO_STATE);
  }
}

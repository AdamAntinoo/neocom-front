/** Cookie helpers for NEOCOM SSO cookies (Path=/ , SameSite=Lax). */

export const COOKIE_MAX_AGE_20_MIN = 1200;

export const NEOCOM_ACCESS = 'neocom_access';
export const NEOCOM_RETURN = 'neocom_return';
export const NEOCOM_SSO_STATE = 'neocom_sso_state';

export function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const prefix = `${name}=`;
  const found = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  if (!found) {
    return null;
  }
  return decodeURIComponent(found.slice(prefix.length));
}

export function writeCookie(name: string, value: string, maxAgeSeconds: number = COOKIE_MAX_AGE_20_MIN): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Path=/; SameSite=Lax; Max-Age=0`;
}

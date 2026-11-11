/**
 * Mock authentication for Cypress acceptance (LOGIN-001 cookie contract).
 * Cookie format matches `formatAccessCookie`: accessToken|characterName|characterId
 */

export const MOCK_ACCESS_TOKEN = 'e2e-mock-token';
export const MOCK_CHARACTER_NAME = 'Perico Tuerto';
export const MOCK_CHARACTER_ID = 93813310;

export const NEOCOM_ACCESS_COOKIE = 'neocom_access';
export const NEOCOM_PILOT_ID_COOKIE = 'neocom-pilot-id';

export function formatMockAccessCookie(overrides?: {
  accessToken?: string;
  characterName?: string;
  characterId?: number;
}): string {
  const accessToken = overrides?.accessToken ?? MOCK_ACCESS_TOKEN;
  const characterName = overrides?.characterName ?? MOCK_CHARACTER_NAME;
  const characterId = overrides?.characterId ?? MOCK_CHARACTER_ID;
  return `${accessToken}|${characterName}|${characterId}`;
}

/** Install `neocom_access` (+ pilot id) so authGuard treats the session as logged in. */
export function mockAuthenticatedSession(overrides?: {
  accessToken?: string;
  characterName?: string;
  characterId?: number;
}): void {
  const characterId = overrides?.characterId ?? MOCK_CHARACTER_ID;
  cy.setCookie(NEOCOM_ACCESS_COOKIE, formatMockAccessCookie(overrides), {
    path: '/',
    sameSite: 'lax',
  });
  cy.setCookie(NEOCOM_PILOT_ID_COOKIE, String(characterId), {
    path: '/',
    sameSite: 'lax',
  });
}

export function clearAuthenticatedSession(): void {
  cy.clearCookie(NEOCOM_ACCESS_COOKIE);
  cy.clearCookie(NEOCOM_PILOT_ID_COOKIE);
}

/**
 * Stub Nest pilot APIs so guarded pages render without a live back (WireMock/Nest optional).
 * Call after mockAuthenticatedSession when visiting authenticated routes.
 */
export function stubAuthenticatedApis(pilotId: number = MOCK_CHARACTER_ID): void {
  cy.intercept('GET', `**/v1/pilots/${pilotId}`, {
    statusCode: 200,
    body: {
      jsonClass: 'PublicPilotV1',
      pilotId,
      name: MOCK_CHARACTER_NAME,
      birthday: '2013-09-09T19:40:09.000Z',
      gender: 'male',
      securityStatus: 0.035,
      url4Icon: `https://image.eveonline.com/Character/${pilotId}_256.jpg`,
      corporation: {
        corporationId: 1000077,
        name: 'Mock Corporation',
        ticker: 'MOCK',
      },
    },
  }).as('mockPilot');

  cy.intercept('GET', `**/v1/pilots/${pilotId}/assets`, {
    statusCode: 200,
    body: [],
  }).as('mockAssets');

  cy.intercept('GET', `**/v1/pilots/${pilotId}/blueprints`, {
    fixture: 'blueprints-by-location.json',
  }).as('mockBlueprints');

  cy.intercept('GET', '**/v1/corporations/**', {
    statusCode: 200,
    body: {
      jsonClass: 'PublicCorporationV1',
      corporationId: 1000077,
      name: 'Mock Corporation',
      ticker: 'MOCK',
    },
  }).as('mockCorporation');
}

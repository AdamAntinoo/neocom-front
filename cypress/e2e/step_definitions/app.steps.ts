import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

/** Matches `formatAccessCookie`: accessToken|characterName|characterId */
const TEST_ACCESS_COOKIE = 'e2e-token|Perico Tuerto|93813310';

Given('I have a completed login session', () => {
  cy.setCookie('neocom_access', TEST_ACCESS_COOKIE, {
    path: '/',
    sameSite: 'lax',
  });
});

When('I open the application home page without a session', () => {
  cy.clearCookie('neocom_access');
  cy.visit('/app/');
});

When('I open the application home page', () => {
  cy.visit('/app/');
});

Then('the login page is visible', () => {
  cy.get('[cy-section-name="login"]').should('be.visible');
  cy.get('[cy-name="EVE-login-button"]').should('be.visible');
});

Then('the application shell is visible', () => {
  cy.get('[cy-section-name="header"]').should('be.visible');
  cy.get('[cy-section-name="pilot-dashboard"]').should('be.visible');
});

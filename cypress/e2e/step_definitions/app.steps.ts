import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I open the application home page', () => {
  cy.visit('/app/');
});

Then('the application shell is visible', () => {
  cy.get('[cy-section-name="header"]').should('be.visible');
  cy.get('[cy-section-name="pilot-dashboard"]').should('be.visible');
});

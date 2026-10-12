import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I open the application home page', () => {
  cy.visit('/');
});

Then('the document title contains {string}', (fragment: string) => {
  cy.title().should('include', fragment);
});

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I open the login page', () => {
  cy.clearCookie('neocom_access');
  cy.visit('/app/login');
});

Then('the app info panel has {int} fields', (count: number) => {
  cy.get('[cy-section-name="app-info"] [cy-field-value]').should('have.length', count);
});

Then(
  'the app info field {string} shows {string} in the {string} font',
  (field: string, content: string, font: string) => {
    cy.get(`[cy-section-name="app-info"] [cy-field-value="${field}"]`)
      .should('have.length', 1)
      .and(($field) => {
        expect($field.text().trim()).to.equal(content);
        expect(getComputedStyle($field[0]).fontFamily).to.include(font);
      });
  },
);

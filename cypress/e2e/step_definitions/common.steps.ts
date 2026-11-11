import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { SupportService } from '../../support/SupportService.support';

const support = new SupportService();

// --- Bootstrap / navigation (CICD-F-062) ---

Given('the application is open at {string}', (path: string) => {
  cy.visit(path.startsWith('/app') ? path : support.translatePath(path));
});

When('I click the feature named {string}', (featureName: string) => {
  cy.get(support.named(featureName)).click();
});

When('I click the button named {string}', (buttonName: string) => {
  cy.get(support.named(buttonName)).click();
});

When('I click the app name', () => {
  cy.get(support.section('app-info')).find(support.fieldValue('app-name')).click();
});

// --- Target selection (CICD-F-063) ---

Given('the target page is {string}', (pageName: string) => {
  cy.get(support.translateTag(pageName)).as('target-page');
});

Given('the target panel is {string}', (panelName: string) => {
  cy.get('@target-page').find(support.translateTag(panelName)).as('target-panel');
});

Given('the target section is {string}', (sectionName: string) => {
  cy.get(support.section(sectionName)).as('target-panel');
});

Given('the target render is {string}', (renderName: string) => {
  cy.get('@target-panel').find(support.render(renderName)).as('target-render');
});

Given('the target item has cy-name {string}', (name: string) => {
  cy.get('@target-panel').find(support.named(name)).as('target-item');
});

// --- Page activation / visibility ---

Then('the {string} page is visible', (pageName: string) => {
  cy.get(support.translateTag(pageName)).should('be.visible').as('target-page');
});

Then('the login page is visible', () => {
  cy.get(support.translateTag('login')).should('be.visible');
  cy.get(support.named('EVE-login-button')).should('be.visible');
});

Then('the application shell is visible', () => {
  cy.get(support.translateTag('dashboard-home')).should('be.visible');
  cy.get(support.translateTag('app-page')).should('be.visible');
  cy.get(support.translateTag('v1-pilot')).should('be.visible');
});

Then('the section named {string} is visible', (sectionName: string) => {
  cy.get(support.section(sectionName)).should('be.visible');
});

Then('the page has a visible section named {string}', (sectionName: string) => {
  cy.get('@target-page').find(support.section(sectionName)).should('be.visible');
});

// --- Field / content assertions (CICD-F-064) ---

Then('the target has a field label {string}', (labelName: string) => {
  cy.get('@target-panel').find(support.fieldLabel(labelName)).should('exist');
});

Then('the target field {string} has value {string}', (fieldName: string, expected: string) => {
  cy.get('@target-panel').find(support.fieldValue(fieldName)).should('contain.text', expected);
});

Then('the button named {string} is enabled', (buttonName: string) => {
  cy.get(support.named(buttonName)).should('not.be.disabled');
});

Then('the button named {string} is disabled', (buttonName: string) => {
  cy.get(support.named(buttonName)).should('be.disabled');
});

Then('the button named {string} is visible', (buttonName: string) => {
  cy.get(support.named(buttonName)).should('be.visible');
});

Then('the target panel is visible', () => {
  cy.get('@target-panel').should('be.visible');
});

Then('the app info panel has {int} fields', (count: number) => {
  cy.get(`${support.section('app-info')} [cy-field-value]`).should('have.length', count);
});

Then(
  'the app info field {string} shows {string} in the {string} font',
  (field: string, content: string, font: string) => {
    cy.get(`${support.section('app-info')} ${support.fieldValue(field)}`)
      .should('have.length', 1)
      .and(($field) => {
        expect($field.text().trim()).to.equal(content);
        expect(getComputedStyle($field[0]).fontFamily).to.include(font);
      });
  },
);

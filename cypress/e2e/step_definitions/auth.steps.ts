import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  clearAuthenticatedSession,
  mockAuthenticatedSession,
  stubAuthenticatedApis,
} from '../../support/auth.support';
import { SupportService } from '../../support/SupportService.support';

const support = new SupportService();

Given('I have a completed login session', () => {
  mockAuthenticatedSession();
  stubAuthenticatedApis();
});

Given('I am authenticated as pilot {string} with id {int}', (name: string, id: number) => {
  mockAuthenticatedSession({ characterName: name, characterId: id });
  stubAuthenticatedApis(id);
});

Given('I have no login session', () => {
  clearAuthenticatedSession();
});

When('I open the application home page without a session', () => {
  clearAuthenticatedSession();
  cy.visit(support.translatePath('home'));
});

When('I open the application home page', () => {
  cy.visit(support.translatePath('home'));
});

When('I open the {string} page', (pageName: string) => {
  cy.visit(support.translatePath(pageName));
});

When('I open the login page', () => {
  clearAuthenticatedSession();
  cy.visit(support.translatePath('login'));
});

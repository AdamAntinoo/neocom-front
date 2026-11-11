import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { SupportService } from '../../support/SupportService.support';

const support = new SupportService();

function hierarchyRoot() {
  return cy.get(support.section('blueprint-by-location')).first();
}

function hierarchyRowWithField(field: string, value: string) {
  return hierarchyRoot()
    .find(support.fieldValue(field))
    .filter((_, el) => (el.textContent ?? '').trim() === value)
    .first()
    .closest('.node-row');
}

Then('the breadcrumb shows {string}', (label: string) => {
  cy.get(support.section('breadcrumb')).should('contain.text', label);
});

Then('the hierarchy shows a field {string} with value {string}', (field: string, value: string) => {
  hierarchyRoot()
    .find(support.fieldValue(field))
    .filter((_, el) => (el.textContent ?? '').trim() === value)
    .should('have.length.at.least', 1);
});

When(
  'I expand the hierarchy row that has field {string} equal to {string}',
  (field: string, value: string) => {
    hierarchyRowWithField(field, value)
      .find('[cy-action="expand-toggle"]')
      .should('be.visible')
      .click();
  },
);

Then(
  'the hierarchy row with field {string} equal to {string} is expanded',
  (field: string, value: string) => {
    hierarchyRowWithField(field, value)
      .find('[cy-action="expand-toggle"]')
      .should('have.attr', 'aria-expanded', 'true');
  },
);

Then(
  'the hierarchy row with field {string} equal to {string} has label {string} equal to {string}',
  (field: string, value: string, labelName: string, labelText: string) => {
    hierarchyRowWithField(field, value)
      .find(support.fieldLabel(labelName))
      .should('contain.text', labelText);
  },
);

Then(
  'the hierarchy row with field {string} equal to {string} has field {string} equal to {string}',
  (field: string, value: string, otherField: string, otherValue: string) => {
    hierarchyRowWithField(field, value)
      .find(support.fieldValue(otherField))
      .should(($el) => {
        expect($el.text().trim()).to.equal(otherValue);
      });
  },
);

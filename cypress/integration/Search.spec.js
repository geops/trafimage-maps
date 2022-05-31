/* eslint-disable no-undef */

describe('Search', () => {
  beforeEach(() => {
    cy.visit('');
    cy.get('#onetrust-accept-btn-handler', { timeout: 10000 }).click();
  });
  it(`should display plural texts`, () => {
    // Input is not visible
    cy.get('.wkp-search-toggle-button').click();
    cy.get('.wkp-search-input input').focus().type('Bern');
    cy.get('[data-cy=wkp-search-section-title]').should(
      'contain',
      'Ergebnisse', // plural
    );
  });

  it('should open a popup on station search.', () => {
    cy.viewport(1440, 900);
    cy.get('.wkp-feature-information').should('not.exist');

    cy.get('.wkp-search-input input')
      .focus()
      .type('B')
      .type('e')
      .type('r')
      .type('n');

    cy.get('#react-autowhatever-1-section-0-item-0').click({ force: true });

    // Popup is opened.
    cy.wait(10000);
    cy.get('.wkp-feature-information').should('be.visible');
  });
});

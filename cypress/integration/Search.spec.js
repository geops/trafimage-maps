/* eslint-disable no-undef */

describe('Search', () => {
  beforeEach(() => {
    cy.visit('');
  });
  it(`should display plural texts`, () => {
    cy.get('#onetrust-accept-btn-handler').click();
    // Input is not visible
    cy.get('.wkp-search-toggle-button').click();
    cy.get('.wkp-search-input input').focus().type('Bern');
    cy.get('[data-cy=wkp-search-section-title]').should(
      'contain',
      'Ergebnisse', // plural
    );
  });
});

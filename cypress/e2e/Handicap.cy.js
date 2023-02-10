import lang from '../../src/lang/de.json';

describe('Handicap Topic', () => {
  beforeEach(() => {
    cy.consent();
    cy.visit('/ch.sbb.handicap');
    cy.get('.wkp-menu-header ').click();
  });

  it('should open a popup on station search.', () => {
    cy.viewport(1440, 900);
    cy.get('.wkp-feature-information').should('not.exist');

    // In handicap topic
    cy.get('.wkp-menu-header .wkp-menu-title', { timeout: 10000 }).contains(
      lang['ch.sbb.handicap'],
    );

    cy.get('.wkp-search-input input')
      .focus()
      .type('B')
      .type('e')
      .type('r')
      .type('n');

    cy.wait(5000);
    cy.get('#react-autowhatever-1-section-0-item-0').click({ force: true });

    // Popup is opened.
    cy.wait(20000);
    cy.get('.wkp-feature-information').should('be.visible');
  });
});

import lang from '../../src/lang/de.json';

describe('Handicap Topic', () => {
  beforeEach(() => {
    cy.visit('');
    cy.get('#onetrust-accept-btn-handler', { timeout: 10000 }).click();
    cy.get('.wkp-menu-header ').click();
    cy.server();
    cy.wait(1000);
  });

  it('should open a popup on station search.', () => {
    cy.viewport(1440, 900);
    cy.get('.wkp-feature-information').should('not.exist');

    cy.get('.wkp-topic-menu-item').eq(2).click();
    cy.wait(1000);

    // In handicap topic
    cy.get('.wkp-menu-header .wkp-menu-title').contains(
      lang['ch.sbb.handicap'],
    );

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

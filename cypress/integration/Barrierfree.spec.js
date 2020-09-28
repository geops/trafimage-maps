import 'cypress-plugin-tab';
import lang from '../../src/lang/de.json';

describe('Barrierfree E2E', () => {
  beforeEach(() => {
    cy.visit('');
    cy.get('.wkp-menu-header ').click();
    cy.wait(1000);
  });

  it('should show visible layer title in menu.', () => {
    cy.get('.wkp-menu-header > .wkp-menu-title').contains(
      lang['ch.sbb.netzkarte.layer'],
    );
  });

  it('should be able to navigate between menu and dialog with Tab.', () => {
    // Move focus from menu to layer information button.
    cy.tab().tab();
    cy.focused().should('have.attr', 'class', 'wkp-info-topic-bt wkp-active');

    // Press enter and focus dialog closer.
    cy.focused().type('{enter}');
    cy.focused().should('have.attr', 'class', 'tm-button tm-dialog-close-bt');

    // Closer dialog and focus back on the information button.
    cy.focused().type('{enter}');
    cy.focused().should('have.attr', 'class', 'wkp-info-topic-bt wkp-active');
  });
});

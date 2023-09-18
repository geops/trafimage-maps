describe('Tarifverbundkarte topic', () => {
  beforeEach(() => {
    cy.consent();
  });

  [
    '/ch.sbb.tarifverbundkarte.public',
    '/ch.sbb.tarifverbundkarte.public?layers=', // TRAFKLEIN-726
  ].forEach((url) => {
    describe(`when loading directly the topic witht url ${url}`, () => {
      beforeEach(() => {
        cy.visit(url);
      });

      it('should display the baselayer', () => {
        cy.viewport(1440, 900);
        cy.get('.maplibregl-map').should('exist');
      });

      it('should open a popup on click', () => {
        cy.viewport(1440, 900);
        cy.get('.maplibregl-map canvas').then(() => {
          cy.wait(5000);
          cy.get('.rs-map').click('center');
          cy.get('.wkp-feature-information').should('be.visible');
        });
      });
    });
  });
});

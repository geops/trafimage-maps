describe('Infrastruktur topic', () => {
  beforeEach(() => {
    cy.consent();
  });

  [
    '/ch.sbb.infrastruktur',
    '/ch.sbb.infrastruktur?layers=', // TRAFKLEIN-726
  ].forEach((url) => {
    describe(`when loading directly the topic witht url ${url}`, () => {
      beforeEach(() => {
        cy.visit(url);
      });

      it('should display the baselayer', () => {
        cy.viewport(1440, 900);
        cy.get('.maplibregl-map').should('exist');
      });
    });
  });
});

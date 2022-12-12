describe('consent', () => {
  it(`opens consent banner`, () => {
    cy.visit('');
    cy.get('#onetrust-accept-btn-handler', { timeout: 10000 }).click();
  });
});

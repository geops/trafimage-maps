describe("FloorSwitcher", () => {
  beforeEach(() => {
    cy.consent();
  });

  it("should display the correct number of levels and insert 2D if not already in response.", () => {
    cy.intercept(
      {
        method: "GET",
        url: /https:\/\/walking\.geops\.io\/availableLevels\?bbox=.*/,
      },
      {
        statusCode: 200,
        body: {
          type: "Feature",
          properties: {
            availableLevels: [-3, -2, -1, 0],
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [8.53949, 47.37684],
                [8.53949, 47.37897],
                [8.5411, 47.37897],
                [8.5411, 47.37684],
              ],
            ],
          },
        },
      },
    ).as("levels");
    cy.visit(
      "/?lang=de&x=950701.28&y=6003978.1&z=19.17&baselayers=ch.sbb.netzkarte,ch.sbb.netzkarte.dark,ch.sbb.netzkarte.luftbild.group,ch.sbb.netzkarte.landeskarte,ch.sbb.netzkarte.landeskarte.grau&layers=ch.sbb.geschosse2D", // Zürich HB
    );
    cy.viewport(1440, 900);
    cy.wait("@levels");
    cy.get('[data-testid="floor-switcher"]')
      .children()
      .should("have.length", 5);
  });

  it("should display arrow buttons on mobile when more than 5 floors in switcher and properly switch on click.", () => {
    cy.intercept(
      {
        method: "GET",
        url: /https:\/\/walking\.geops\.io\/availableLevels\?bbox=.*/,
      },
      {
        statusCode: 200,
        body: {
          type: "Feature",
          properties: {
            availableLevels: [-3, -2, -1, 0, 1],
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [8.53949, 47.37684],
                [8.53949, 47.37897],
                [8.5411, 47.37897],
                [8.5411, 47.37684],
              ],
            ],
          },
        },
      },
    ).as("levels");
    cy.visit(
      "/?lang=de&x=950701.28&y=6003978.1&z=19.17&baselayers=ch.sbb.netzkarte,ch.sbb.netzkarte.dark,ch.sbb.netzkarte.luftbild.group,ch.sbb.netzkarte.landeskarte,ch.sbb.netzkarte.landeskarte.grau&layers=ch.sbb.geschosse2D", // Zürich HB
    );
    cy.viewport("iphone-7");
    cy.wait("@levels");
    cy.get('[data-testid="floor-switcher"]')
      .children()
      .should("have.length", 3);
    const arrowUpBtn = cy.get('[data-testid="floor-switcher-up-btn"]');
    arrowUpBtn.should("exist");
    arrowUpBtn.click();
    cy.url().should("include", "ch.sbb.geschosse1");
    cy.get('[data-testid="floor-switcher-floor2D-btn"]').click();
    cy.url().should("include", "ch.sbb.geschosse2D");
    cy.viewport("iphone-7", "landscape");
    cy.get('[data-testid="floor-switcher"]').should("not.exist");
  });
});

describe("FloorSwitcher", () => {
  beforeEach(() => {
    cy.consent();
  });

  it("should move to the left corresponding to the overlay width.", () => {
    cy.visit(
      "/?lang=de&x=950701.28&y=6003978.1&z=19.17&baselayers=ch.sbb.netzkarte,ch.sbb.netzkarte.dark,ch.sbb.netzkarte.luftbild.group,ch.sbb.netzkarte.landeskarte,ch.sbb.netzkarte.landeskarte.grau&layers=ch.sbb.geschosse2D", // Zürich HB
    );
    cy.intercept(
      {
        method: "GET",
        pathname: /walking.geops.io/,
      },
      {
        statusCode: 200,
        body: {
          type: "Feature",
          properties: {
            availableLevels: [-4, -3, -2, -1, 0],
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
    cy.viewport(1440, 900);
    cy.get('[data-testid="floor-switcher"]')
      .children()
      .should("have.length", 5);
  });
});

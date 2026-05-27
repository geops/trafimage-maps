describe("MapControls", () => {
  beforeEach(() => {
    cy.consent();
    cy.visit("");
    cy.get(".wkp-menu-header ").click();
    cy.wait(1000);
  });

  it("should move to the left corresponding to the overlay width.", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: /stops\/v1/,
      },
      {
        fixture: "search-stops-bern.json",
      },
    ).as("search");
    cy.intercept(
      {
        method: "GET",
        pathname: /(municipalities|lines|SearchServer|bps)/,
      },
      {
        fixture: "empty-feature-collection.json",
      },
    ).as("others");
    cy.viewport(1440, 900);
    cy.get('[data-testid="map-controls-wrapper"]')
      .then(($mapControlsEl) => window.getComputedStyle($mapControlsEl[0]))
      .invoke("getPropertyValue", "right")
      .should("equal", "0px");
    cy.get(".wkp-search-input input")
      .focus()
      .type("Bern")
      .then(() => {
        cy.wait("@others");
        cy.wait("@search");
        cy.get("#react-autowhatever-1-section-0-item-0")
          .click({ force: true })
          .then(() => {
            const overlay = cy.get(".wkp-feature-information", {
              timeout: 40000,
            });
            overlay.should("be.visible");
            overlay.then(($overlayEl) => {
              const overlayWidth = parseInt(
                window.getComputedStyle($overlayEl[0]).width.replace("px", ""),
                10,
              );
              cy.get('[data-testid="map-controls-wrapper"]')
                .then(($mapControlsEl) =>
                  window.getComputedStyle($mapControlsEl[0]),
                )
                .invoke("getPropertyValue", "right")
                .should("equal", `${overlayWidth}px`);
            });
          });
      });
  });
});

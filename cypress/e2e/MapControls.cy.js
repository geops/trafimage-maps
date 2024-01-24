describe("MapControls", () => {
  beforeEach(() => {
    cy.consent();
    cy.visit("");
    cy.get(".wkp-menu-header ").click();
    cy.wait(1000);
  });

  it("should move to the left corresponding to the overlay width.", () => {
    cy.viewport(1440, 900);
    cy.get('[data-testid="map-controls-wrapper"]')
      .then(($el) => {
        return window.getComputedStyle($el[0]);
      })
      .invoke("getPropertyValue", "right")
      .should("equal", "15px");
    cy.get(".wkp-search-input input")
      .focus()
      .type("B")
      .type("e")
      .type("r")
      .type("n");
    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });
    const overlay = cy.get(".wkp-feature-information", { timeout: 40000 });
    overlay.should("be.visible");
    overlay.then(($overlayEl) => {
      const overlayWidth = parseInt(
        window.getComputedStyle($overlayEl[0]).width.replace("px", ""),
        10,
      );
      cy.get('[data-testid="map-controls-wrapper"]')
        .then(($mapControlsEl) => {
          return window.getComputedStyle($mapControlsEl[0]);
        })
        .invoke("getPropertyValue", "right")
        .should("equal", `${overlayWidth + 15}px`);
    });
  });

  it("should remove zoomslider on landscape tablet heights.", () => {
    cy.get(".rs-zoomslider-wrapper").should("not.exist");
  });
});

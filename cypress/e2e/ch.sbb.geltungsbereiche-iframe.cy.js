describe("Geltungsbereiche iframe topic", () => {
  beforeEach(() => {
    cy.consent();
    cy.visit("/ch.sbb.geltungsbereiche-iframe");
  });

  it("should show/hide some elements", () => {
    cy.viewport(1440, 900);
    cy.get(".tm-trafimage-maps").should("exist");

    // header + telephoneinfos
    cy.get(".wkp-header").should("not.exist");
    // search
    cy.get(".wkp-search").should("not.exist");
    // telephoneInfos
    cy.get('[data-testid="wkp-tel-infos"]').should("not.exist");
    // menu
    cy.get(".wkp-topics-menu").should("not.exist");
    // baseLayerSwitcher
    cy.get(".rs-base-layer-switcher").should("not.exist");
    // mapControls
    cy.get(".wkp-map-controls").should("exist");
    // geolocationButton
    cy.get(".wkp-fit-extent").should("exist");
    // fitExtent
    cy.get(".wkp-geolocation").should("not.exist");
    // footer
    cy.get(".wkp-footer").should("not.exist");

    // topicMenu
    cy.get(".wkp-gb-topic-menu").should("exist");
  });
});

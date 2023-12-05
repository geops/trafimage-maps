/* eslint-disable import/no-extraneous-dependencies */
import "cypress-plugin-tab";
import "cypress-enter-plugin";
import lang from "../../src/lang/de.json";

describe("Barrierfree E2E", () => {
  beforeEach(() => {
    cy.consent();
    cy.visit("");
    cy.get(".wkp-menu-header ").click();
    cy.wait(1000);
  });

  it("should show visible layer title in menu.", () => {
    cy.get(".wkp-menu-header .wkp-menu-title").contains(
      lang["ch.sbb.netzkarte.layer"],
    );
  });

  it("should be able to navigate between menu and dialog with Tab.", () => {
    // Move focus from menu to layer information button.
    cy.focused().tab().tab();
    ["wkp-info-bt", "wkp-active"].forEach((cls) => {
      cy.focused().should("have.class", cls);
    });

    // Press enter and focus dialog closer.
    cy.focused().type("{enter}");
    cy.focused({ timeout: 5000 }).should(
      "have.attr",
      "title",
      "Dialog schließen",
    );
    cy.focused().then(($el) => {
      expect($el[0].title).to.equal("Dialog schließen");
    });

    // Closer dialog and focus back on the information button.
    cy.focused().type("{enter}");
    ["wkp-info-bt", "wkp-active"].forEach((cls) => {
      cy.focused().should("have.class", cls);
    });
  });
});

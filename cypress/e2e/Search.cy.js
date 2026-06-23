/* eslint-disable no-undef */

describe("Search", () => {
  beforeEach(() => {
    cy.consent();
    cy.visit("");
  });

  it("should open a popup on station search.", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: /stops\/v1/,
        path: /q=Bern/,
      },
      {
        fixture: "search-stops-bern-bahnhof.json",
      },
    ).as("search");

    cy.viewport(1440, 900);
    cy.get(".wkp-feature-information").should("not.exist");

    cy.get(".wkp-search-input input")
      .focus()
      .type("B")
      .type("e")
      .type("r")
      .type("n");

    cy.wait("@search");

    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });

    // Popup is opened.
    cy.get(".wkp-feature-information", { timeout: 40000 }).should("be.visible");
  });

  it("should open a popup on station search using a station that appears after zoom 15.5", () => {
    cy.viewport(1440, 900);
    // https://api.geops.io/stops/v1/?&q=Bern%20Ba&key=5cc87b12d7c5370001c1d6554840ecb89d2743d2b0aad0588b8ba7eb&limit=50
    cy.intercept(
      {
        method: "GET",
        pathname: /stops\/v1/,
        path: /q=Bern%20Bahnhof/,
      },
      {
        fixture: "search-stops-bern-bahnhof.json",
      },
    ).as("search");
    cy.get(".wkp-feature-information").should("not.exist");

    cy.get(".wkp-search-input input").focus().type("Bern Bahnhof");

    cy.wait("@search");

    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });

    // Popup is opened.
    cy.get(".wkp-feature-information", { timeout: 20000 }).should("be.visible");
  });

  it("should not open a popup on station search because we click on the clear button", () => {
    cy.viewport(1440, 900);
    cy.get(".wkp-feature-information").should("not.exist");

    cy.get(".wkp-search-input input")
      .focus()
      .type("B")
      .type("e")
      .type("r")
      .type("n");

    cy.wait(1000);

    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });

    cy.get(".wkp-search-button-clear").click();

    // Popup is opened.
    cy.get(".wkp-feature-information", { timeout: 20000 }).should("not.exist");
  });

  it("should not open a popup on station search using a station that appears after zoom 15.5 because we click on the clear button", () => {
    cy.viewport(1440, 900);
    cy.get(".wkp-feature-information").should("not.exist");

    cy.get(".wkp-search-input input").focus().type("Bern Bahnhof");

    cy.wait(1000);

    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });

    cy.get(".wkp-search-button-clear").click();

    // Popup is opened
    cy.get(".wkp-feature-information", { timeout: 20000 }).should("not.exist");
  });

  it("should close the popup after a station search then we click on the clear button", () => {
    cy.viewport(1440, 900);
    cy.get(".wkp-feature-information").should("not.exist");

    cy.get(".wkp-search-input input")
      .focus()
      .type("B")
      .type("e")
      .type("r")
      .type("n");

    cy.wait(1000);

    cy.get("#react-autowhatever-1-section-0-item-0").click({ force: true });

    // Popup is opened.
    cy.get(".wkp-feature-information", { timeout: 20000 }).should("be.visible");
    cy.get(".wkp-search-button-clear").click();
    // Popup is closed.
    cy.get(".wkp-feature-information").should("not.exist");
  });

  it("should not crash when search services returns a json error", () => {
    cy.viewport(1440, 900);
    cy.intercept(
      {
        method: "GET",
        pathname: /(stops|search|api3-geo-admin\/SearchServer)/,
      },
      {
        statusCode: 500,
        body: { detail: "foo error" },
      },
    );
    cy.get(".wkp-search-input input").focus().type("Ber");
    cy.wait(1000);
    cy.get(".wkp-search-input input", { timeout: 20000 }).should("be.visible");
  });

  it("should not crash when search services returns a non json error", () => {
    cy.viewport(1440, 900);
    cy.intercept(
      {
        method: "GET",
        pathname: /(stops|search|api3-geo-admin\/SearchServer)/,
      },
      {
        statusCode: 500,
        body: "Error 500",
      },
    );
    cy.get(".wkp-search-input input").focus().type("Ber");
    cy.wait(1000);
    cy.get(".wkp-search-input input", { timeout: 20000 }).should("be.visible");
  });

  it(`should display plural texts`, () => {
    // Input is not visible
    cy.get(".wkp-search-toggle-button").click();
    cy.get(".wkp-search-input input").focus().type("Bern");
    cy.wait(1000);
    cy.get(".wkp-search-section-header").should(
      "contain",
      "Ergebnisse", // plural
    );
  });
});

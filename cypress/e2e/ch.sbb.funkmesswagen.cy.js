// eslint-disable-next-line import/no-extraneous-dependencies

const response = {
  title: "Mewa 12",
  latitude: 46.945881979666666,
  longitude: 7.4081100135,
  info: [
    {
      label: "Datum",
      value: "05.03.2024",
    },
    {
      label: "Zeit",
      value: "11:08:07 UTC",
    },
    {
      label: "Navigation",
      value: "iNAT-RQT",
    },
    {
      label: "Satelliten",
      value: "0",
    },
    {
      label: "Richtung",
      value: "N_HBS",
    },
    {
      label: "V WGI",
      value: "127.4 km/h",
    },
  ],
  gwVersion: "v1.0.1",
};

describe("Funkmesswagen topic", () => {
  beforeEach(() => {
    // make sure the request is not cached, it breaks FF otherwise
    cy.intercept("**/messwagen/*.json", { middleware: true }, (req) => {
      req.on("before:response", (res) => {
        // force all API responses to not be cached
        res.headers["cache-control"] = "no-store";
      });
    });
    cy.consent();
  });

  it("should show/hide some elements", () => {
    cy.visit("/ch.sbb.funkmesswagen");
    cy.viewport(1440, 900);
    cy.get(".tm-trafimage-maps").should("exist");

    // header + telephoneinfos
    cy.get(".wkp-header").should("exist");

    // search
    cy.get(".wkp-search").should("exist");
    // telephoneInfos
    cy.get('[data-testid="wkp-tel-infos"]').should("exist");
    // menu
    cy.get(".wkp-topics-menu").should("exist");
    // baseLayerSwitcher
    cy.get(".rs-base-layer-switcher").should("exist");
    // mapControls
    cy.get(".wkp-map-controls").should("exist");
    // geolocationButton
    cy.get(".wkp-fit-extent").should("exist");
    // fitExtent
    cy.get(".wkp-geolocation").should("exist");

    // footer
    cy.get(".wkp-footer").should("exist");
    cy.get(".wkp-share-menu").should("not.exist");
    cy.get(".wkp-draw-menu").should("not.exist");
  });

  it("should have pdf links in layer infos", () => {
    cy.viewport(1440, 900);
    cy.visit("/ch.sbb.funkmesswagen");
    cy.get(".wkp-menu-header ").click();
    cy.get("[data-cy='infos-button-ch.sbb.funkmesswagen']").click();
    cy.get(
      'a[href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-vorjahr.pdf"]',
    ).should("exist");
    cy.get(
      'a[href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-aktuell.pdf"]',
    ).should("exist");
    cy.get(
      'a[href="https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-folgejahr.pdf"]',
    ).should("exist");
  });

  it("should fetch mewa12.json and display Mewa 12 title", () => {
    cy.viewport(1440, 900);
    cy.visit("/ch.sbb.funkmesswagen");
    cy.intercept(
      { method: "GET", url: /\/messwagen\/mewa12.json/ },
      {
        statusCode: 200,
        body: response,
      },
    ).as("json");
    cy.wait("@json");
    cy.get("[data-cy='messwagen-popup']").should("contain.text", "Mewa 12");
  });

  it("should fetch mb.json and display Mess-Bus title", () => {
    cy.viewport(1440, 900);
    cy.visit("/ch.sbb.funkmesswagen?layers=ch.sbb.funkmesswagen.mb");
    cy.intercept(
      { method: "GET", url: /\/messwagen\/mb.json/ },
      {
        statusCode: 200,
        body: {
          ...response,
          title: "Mess-Bus",
        },
      },
    ).as("json");
    cy.wait("@json");
    cy.get("[data-cy='messwagen-popup']").should("contain.text", "Mess-Bus");
  });

  it("should fetch mobile.json and display Mobile title", () => {
    cy.viewport(1440, 900);
    cy.visit("/ch.sbb.funkmesswagen?layers=ch.sbb.funkmesswagen.mobile");
    cy.intercept(
      { method: "GET", url: /\/messwagen\/mobile.json/ },
      {
        statusCode: 200,
        body: {
          ...response,
          title: "Mobile",
        },
      },
    ).as("json");
    cy.wait("@json");
    cy.get("[data-cy='messwagen-popup']").should("contain.text", "Mobile");
  });

  it("should display content of json file in popup", () => {
    cy.viewport(1440, 900);
    cy.visit("/ch.sbb.funkmesswagen");
    cy.intercept(
      { method: "GET", url: /messwagen\/mewa12.json/ },
      {
        body: response,
      },
    ).as("json");
    cy.wait("@json");
    cy.get("[data-cy='messwagen-popup']").should("contain.text", "Mewa 12");

    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "Datum:05.03.2024",
    );
    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "Zeit:11:08:07 UTC",
    );
    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "Navigation:iNAT-RQT",
    );
    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "Satelliten:0",
    );
    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "Richtung:N_HBS",
    );
    cy.get("[data-cy='messwagen-popup']").should(
      "contain.text",
      "V WGI:127.4 km/h",
    );
    cy.get(
      "a[href='https://maps.trafimage.ch/funkmesswagen-einsatzplanung/infra-mewa-programm-aktuell.pdf']",
    ).should("contain.text", `Einsatzplanung ${new Date().getFullYear()}`);
  });
});

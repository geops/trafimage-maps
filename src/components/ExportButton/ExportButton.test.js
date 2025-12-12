import React from "react";
import XMLSerializer from "xmlserializer";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import ExportButton from "./ExportButton";
import tarifverbundkarteLegend from "../../img/tarifverbund_legend.url.svg";
import energieLegend from "../../img/energie_legend_pub.url.svg";
import railplusLegend from "../../img/railplus_legend.svg";
import { SWISS_CENTER } from "../../utils/constants";
import theme from "../../themes/default";

describe("ExportButton", () => {
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = { hostname: "wkp-dev.foo" };
  afterEach(() => jest.restoreAllMocks());
  [tarifverbundkarteLegend, energieLegend, railplusLegend].forEach((legend) => {
    test("legend svg must be parseable/serializable by native DOMParser and XML Serializer", (done) => {
      try {
        const svgDoc = new DOMParser().parseFromString(
          legend,
          "application/xml",
        );
        svgDoc.documentElement.removeAttribute("width");
        svgDoc.documentElement.removeAttribute("height");
        // The real XMLSerializer was drop by node 12, see https://github.com/facebook/jest/issues/7537
        // so we use an npm module that does the same.
        XMLSerializer.serializeToString(svgDoc);
        done();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          "tarifverbund_legend.svg is not parseable/serializable by native parser/serializer",
        );
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });
  });

  test("should trigger tracking event", () => {
    const exportCoordinates = [SWISS_CENTER, SWISS_CENTER];
    // Ignore errors, because test case is about tracking event
    jest.spyOn(console, "error");
    // eslint-disable-next-line no-console
    console.error.mockImplementation(() => {});
    const { store } = global;
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ExportButton exportCoordinates={exportCoordinates} />
        </Provider>
      </ThemeProvider>,
    );
    fireEvent.click(getByRole("button"));
    expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
      /PDF export/i,
    );
  });
});

import React from "react";

import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import OLLayer from "ol/layer/Vector";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import { bahnhofplaene } from "../../config/ch.sbb.netzkarte";
import LayerInfosDialog from ".";

describe("LayerInfosDialog", () => {
  let store;
  let layer;

  beforeEach(() => {
    layer = new Layer({
      name: "test",
      olLayer: new OLLayer(),
      properties: {
        description: "description<br/>break",
      },
    });
    store = global.mockStore({
      app: {
        language: "de",
        t: (t) => t,
      },
    });
  });

  test("should match snapshot when Layer is null", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <LayerInfosDialog />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test("should match snapshot when Layer is defined", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <LayerInfosDialog selectedForInfos={layer} />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  describe("should display data link ", () => {
    test("for layer bahnhofplaene", () => {
      const { container } = render(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <LayerInfosDialog selectedForInfos={bahnhofplaene} />
          </Provider>
        </ThemeProvider>,
      );

      const link = container.querySelector("a.wkp-link");
      expect(link.href).toBe(
        "https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/",
      );
    });
  });
});

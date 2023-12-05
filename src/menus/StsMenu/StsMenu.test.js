import React from "react";
import { Provider } from "react-redux";

import { render, within, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import OLMap from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import StsMenu from "./StsMenu";
import { sts } from "../../config/topics";
import stsLayers from "../../config/ch.sbb.sts";
import highlightPointStyle from "../../utils/highlightPointStyle";
import theme from "../../themes/default";

describe("StsMenu", () => {
  let store;

  beforeEach(() => {
    stsLayers.find((layer) => layer.get("isBaseLayer")).url =
      "https://foo-maps.io";
    const highlightLayer = new VectorLayer({
      source: new VectorSource({ features: [] }),
    });
    highlightLayer.setStyle(highlightPointStyle);
    store = global.mockStore({
      map: { layers: stsLayers, highlightLayer },
      app: {
        map: new OLMap({}),
        activeTopic: sts,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test("should render the menu opener and sts validity layerswitcher on load", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <StsMenu />
        </Provider>
      </ThemeProvider>,
    );

    const opener = getByTestId("sts-menu-opener");
    expect(opener).toBeTruthy();
    const { getByText } = within(opener);
    expect(getByText("Validity of Swiss Travel Pass")).toBeInTheDocument();
    expect(getByTestId("sts-validity-layerswitcher")).toBeTruthy();
  });

  test("should switch to Direktverbindungen when switching in the menu", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <StsMenu />
        </Provider>
      </ThemeProvider>,
    );

    const opener = getByTestId("sts-menu-opener");
    expect(opener).toBeTruthy();
    const menuPopover = getByTestId("sts-menu-popover");
    expect(menuPopover.getAttribute("aria-hidden")).toEqual("true");
    fireEvent.click(opener);
    expect(menuPopover.getAttribute("aria-hidden")).toEqual(null);
    fireEvent.click(getByTestId("sts-menu-dv"));
    expect(menuPopover.getAttribute("aria-hidden")).toEqual("true");
    const { getByText } = within(opener);
    expect(getByText("Direct trains to Switzerland")).toBeInTheDocument();
  });
});

import React from "react";
import { Provider } from "react-redux";

import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OLMap from "ol/Map";
import DvMenu from "./DvMenu";
import { getTopics } from "../../config/topics";
import { DV_KEY } from "../../utils/constants";
import highlightPointStyle from "../../utils/highlightPointStyle";
import theme from "../../themes/default";

const direktverbindungenIframe = getTopics().wkp.find(
  (t) => t.key === "ch.sbb.direktverbindungen-iframe",
);
const dvLayers = direktverbindungenIframe.layers;
describe("DvMenu", () => {
  let store;
  const highlightLayer = new VectorLayer({
    source: new VectorSource({ features: [] }),
  });
  highlightLayer.setStyle(highlightPointStyle);

  beforeEach(() => {
    dvLayers.find((layer) => layer.get("isBaseLayer")).url =
      "https://foo-maps.io";
    store = global.mockStore({
      map: { layers: dvLayers, highlightLayer },
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        map: new OLMap({}),
        activeTopic: direktverbindungenIframe,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test("should render two checked switches for two visible layers and deactivate on click", () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DvMenu />
        </Provider>
      </ThemeProvider>,
    );

    expect(getByTestId("dv-layerswitcher")).toBeTruthy();
    const nightLayer = dvLayers.find(
      (layer) => layer.key === `${DV_KEY}.night`,
    );
    const dayLayer = dvLayers.find((layer) => layer.key === `${DV_KEY}.day`);
    [nightLayer, dayLayer].forEach((layer) => {
      expect(layer.visible).toBe(true);
      expect(
        getByTestId(`dv-layerswitcher-${layer.key}`).classList.contains(
          "Mui-checked",
        ),
      );
    });
    const nightSwitch = getByTestId(`dv-layerswitcher-${nightLayer.key}`);
    fireEvent.click(nightSwitch);
    expect(nightSwitch.classList.contains("Mui-checked")).toBe(false);
  });

  test("should not hide menu on mobile", () => {
    store = global.mockStore({
      map: { layers: dvLayers, highlightLayer },
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        map: new OLMap({}),
        activeTopic: direktverbindungenIframe,
        featureInfo: [],
        displayMenu: true,
        screenWidth: "xs",
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DvMenu />
        </Provider>
      </ThemeProvider>,
    );
    expect(store.getActions()[0]).toEqual({
      type: "SET_DISPLAY_MENU",
      data: false,
    });
  });
});

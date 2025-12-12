import React from "react";
import { Provider } from "react-redux";

import { Layer } from "mobility-toolbox-js/ol";
import { render } from "@testing-library/react";
import OLLayer from "ol/layer/Layer";
import DrawLayerMenu from "./DrawLayerMenu";

describe("DrawLayerMenu", () => {
  let store;
  const drawLayer = new Layer({
    olLayer: new OLLayer({}),
  });

  describe("should match snapshot.", () => {
    test("should return null", () => {
      store = global.mockStore({
        map: {
          layers: [],
          drawLayer,
        },
        app: { i18n: global.i18n },
      });
      const { container } = render(
        <Provider store={store}>
          <DrawLayerMenu />
        </Provider>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("using the layerService property", () => {
      store = global.mockStore({
        i18n: global.i18n,
        map: {
          drawLayer,
          layers: [],
        },
        app: { i18n: global.i18n, drawIds: { admin_id: "foo" } },
      });
      const { container } = render(
        <Provider store={store}>
          <DrawLayerMenu />
        </Provider>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  test("display only draw layer", () => {
    const layers = [
      new Layer({ olLayer: new OLLayer({}) }),
      store.getState().map.drawLayer,
    ];
    store = global.mockStore({
      map: {
        drawLayer,
        layers,
      },
      app: { i18n: global.i18n, drawIds: { admin_id: "foo" } },
    });
    const { container } = render(
      <Provider store={store}>
        <DrawLayerMenu />
      </Provider>,
    );
    expect(layers.length).toBe(2);
    expect(container.querySelectorAll(".rs-layer-tree-item").length).toBe(1);
  });
});

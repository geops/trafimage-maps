import React from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { Layer } from "mobility-toolbox-js/ol";
import { render } from "@testing-library/react";
import OLLayer from "ol/layer/Layer";
import DrawLayerMenu from "./DrawLayerMenu";

describe("DrawLayerMenu", () => {
  const mockStore = configureStore([thunk]);
  let store;
  const drawLayer = new Layer({
    olLayer: new OLLayer({}),
  });

  describe("should match snapshot.", () => {
    test("should return null", () => {
      store = mockStore({
        map: {
          layers: [],
          drawLayer,
        },
        app: {},
      });
      const { container } = render(
        <Provider store={store}>
          <DrawLayerMenu />
        </Provider>,
      );
      expect(container.innerHTML).toMatchSnapshot();
    });

    test("using the layerService property", () => {
      store = mockStore({
        map: {
          drawLayer,
          layers: [],
        },
        app: {
          drawIds: { admin_id: "foo" },
        },
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
    store = mockStore({
      map: {
        drawLayer,
        layers,
      },
      app: {
        drawIds: { admin_id: "foo" },
      },
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

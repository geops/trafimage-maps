import * as React from "react";
import { render, act } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import { Feature } from "ol";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";

import theme from "../themes/default";
import useUpdateFeatureInfoOnLayerToggle from "./useUpdateFeatureInfoOnLayerToggle";

const layer = new Layer({
  visible: true,
});
const featureInfo = [
  {
    layer,
    features: [new Feature()],
    coordinate: [0, 0],
  },
];

function TestComponent() {
  useUpdateFeatureInfoOnLayerToggle([layer]);
  return null;
}

describe("useUpdateFeatureInfoOnLayerToggle", () => {
  let store;
  beforeEach(() => {
    store = global.mockStore({
      app: { i18n: global.i18n, featureInfo },
    });
  });
  test("should remove featureInfo when layer is deactivated", () => {
    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <TestComponent />
        </Provider>
      </ThemeProvider>,
    );
    act(() => {
      layer.visible = false;
    });
    expect(store.getActions()).toEqual([
      {
        type: "SET_FEATURE_INFO",
        data: [],
      },
    ]);
    unmount();
  });
});

import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import useHighlightSomeFeatures from "./useHighlightSomeFeatures";

const feature1 = {};
const feature2 = {};
const feature3 = {};
const feature4 = {};
const layer1 = {
  highlight: jest.fn(),
};
const layer2 = {
  highlight: jest.fn(),
};
const featureInfo = [
  {
    layer: layer1,
    features: [feature1, feature2],
  },
  {
    layer: layer2,
    features: [feature3, feature4],
  },
  {
    layer: {},
    features: [],
  },
];

// eslint-disable-next-line react/prop-types
function Test({ feature, layer }) {
  useHighlightSomeFeatures(feature, layer);
  return null;
}

describe("useHighlightSomeFeatures", () => {
  test("should highlight only the features of the current layer", () => {
    const store = global.mockStore({ app: { i18n: global.i18n, featureInfo } });
    const { rerender } = render(
      <Provider store={store}>
        <Test feature={[feature1]} layer={layer1} />
      </Provider>,
    );
    expect(layer1.highlight).toHaveBeenCalledTimes(1);
    expect(layer1.highlight).toHaveBeenCalledWith([feature1]);
    expect(layer2.highlight).toHaveBeenCalledTimes(1);
    expect(layer2.highlight).toHaveBeenCalledWith();

    rerender(
      <Provider store={store}>
        <Test feature={[feature3, feature4]} layer={layer2} />{" "}
      </Provider>,
    );
    expect(layer1.highlight).toHaveBeenCalledTimes(3); // unmount and rerender
    expect(layer1.highlight).toHaveBeenCalledWith();
    expect(layer2.highlight).toHaveBeenCalledTimes(2);
    expect(layer2.highlight).toHaveBeenCalledWith([feature3, feature4]);
  });
});

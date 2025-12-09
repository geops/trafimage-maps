import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import TopicInfosButton from ".";

describe("TopicInfosButton", () => {
  let store;

  test("renders active state", () => {
    const info = { key: "foo" };
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, activeTopic: info, selectedForInfos: {} },
    });
    const { container } = render(
      <Provider store={store}>
        <TopicInfosButton topic={info} />
      </Provider>,
    );
    expect(container.querySelector("button").className).toMatch(
      "wkp-info-bt wkp-active",
    );
  });

  test("renders selected and active state", () => {
    const info = { key: "foo" };
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, activeTopic: info, selectedForInfos: info },
    });
    const { container } = render(
      <Provider store={store}>
        <TopicInfosButton topic={info} />
      </Provider>,
    );
    expect(container.querySelector("button").className).toMatch(
      "wkp-info-bt wkp-active wkp-selected",
    );
  });
});

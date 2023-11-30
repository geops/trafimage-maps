import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import TopicInfosButton from ".";

describe("TopicInfosButton", () => {
  const mockStore = configureStore([thunk]);
  let store;

  test("renders active state", () => {
    const info = { key: "foo" };
    store = mockStore({
      map: {},
      app: { activeTopic: info, selectedForInfos: {} },
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
    store = mockStore({
      map: {},
      app: { activeTopic: info, selectedForInfos: info },
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

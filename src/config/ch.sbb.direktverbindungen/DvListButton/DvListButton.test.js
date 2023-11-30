import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import OLMap from "ol/Map";
import dvLayers from "../index";
import { direktverbindungenIframe } from "../../topics";
import DvListButton from "./DvListButton";

describe("DvListButton", () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: { layers: dvLayers },
      app: {
        map: new OLMap({}),
        activeTopic: direktverbindungenIframe,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test("should match snapshot and be disabled on load.", () => {
    const { container, getByTestId } = render(
      <Provider store={store}>
        <DvListButton />
      </Provider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
    expect(getByTestId("dv-list-button")).toBeDisabled();
  });
});

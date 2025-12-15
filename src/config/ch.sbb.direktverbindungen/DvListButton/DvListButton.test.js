import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import OLMap from "ol/Map";
import { ThemeProvider } from "@mui/material";
import { getTopics } from "../../topics";
import DvListButton from "./DvListButton";
import theme from "../../../themes/default";

const direktverbindungenIframe = getTopics().wkp.find(
  (topic) => topic.key === "ch.sbb.direktverbindungen-iframe",
);

describe("DvListButton", () => {
  let store;

  beforeEach(() => {
    store = global.mockStore({
      map: {
        layers: direktverbindungenIframe.layers,
      },
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

  test("should match snapshot and be disabled on load.", () => {
    const { container, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DvListButton />
        </Provider>
        ,
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
    expect(getByTestId("dv-list-button")).toBeDisabled();
  });
});

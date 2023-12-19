import React from "react";

import { Provider } from "react-redux";

import { Map, View } from "ol";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import Dialog from "./Dialog";

describe("Dialog", () => {
  let store;
  let map;

  beforeEach(() => {
    store = global.mockStore({
      map: {},
      app: {},
    });
    map = new Map({ view: new View({}) });
  });

  test("should match snapshot.", () => {
    const component = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Dialog map={map} name="foo" />
        </Provider>
      </ThemeProvider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  // TODO: test focus document.activeElement on popup close
});

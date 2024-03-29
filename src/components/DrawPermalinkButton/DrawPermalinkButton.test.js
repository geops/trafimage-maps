import React from "react";
import { Provider } from "react-redux";

import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import theme from "../../themes/default";
import DrawPermalinkButton from ".";

describe("DrawPermalinkButton", () => {
  let store;
  test("should match snapshot.", () => {
    store = global.mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DrawPermalinkButton />
        </Provider>
      </ThemeProvider>,
    );
    expect(
      component.container.querySelectorAll(".wkp-permalink-bt").length,
    ).toBe(1);
    expect(component.container.querySelectorAll("button").length).toBe(1);
  });
});

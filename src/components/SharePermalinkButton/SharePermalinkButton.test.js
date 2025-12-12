import React from "react";
import { Provider } from "react-redux";

import { render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import SharePermalinkButton from ".";

describe("SharePermalinkButton", () => {
  let store;
  test("should match snapshot.", async () => {
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, drawIds: {} },
    });

    const component = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SharePermalinkButton />
        </Provider>
      </ThemeProvider>,
    );

    // Remove act warning in logs
    await waitFor(() => {
      return false;
    });
    expect(
      component.container.querySelectorAll(".wkp-permalink-bt").length,
    ).toBe(1);
    expect(component.container.querySelectorAll("button").length).toBe(1);
  });
});

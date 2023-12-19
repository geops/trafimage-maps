import React from "react";

import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import Header from "./Header";

describe("Header", () => {
  test("match snapshots", () => {
    const store = global.mockStore({
      map: {},
      app: { language: "fr" },
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Header />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });
});

import React from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import Header from "./Header";

describe("Header", () => {
  test("match snapshots", () => {
    const mockStore = configureStore([thunk]);
    const store = mockStore({
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

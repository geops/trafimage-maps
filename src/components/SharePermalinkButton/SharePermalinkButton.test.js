import React from "react";
import { Provider } from "react-redux";

import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import SharePermalinkButton from ".";

describe("SharePermalinkButton", () => {
  let store;
  test("should match snapshot.", () => {
    store = global.mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SharePermalinkButton />
        </Provider>
      </ThemeProvider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});

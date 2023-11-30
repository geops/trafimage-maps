import React from "react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import theme from "../../themes/default";
import DrawPermalinkButton from ".";

describe("DrawPermalinkButton", () => {
  const mockStore = configureStore([thunk]);
  let store;
  test("should match snapshot.", () => {
    store = mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DrawPermalinkButton>
            <div />
          </DrawPermalinkButton>
        </Provider>
      </ThemeProvider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});

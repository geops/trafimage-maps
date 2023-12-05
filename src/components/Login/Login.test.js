import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import Login from ".";

describe("Login", () => {
  describe("matches snapshot", () => {
    test("displaying default text", () => {
      const store = global.global.mockStore({
        app: { appBaseUrl: "http://foo.de" },
      });
      const component = render(
        <Provider store={store}>
          <Login />
        </Provider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test("displaying user name", () => {
      const store = global.global.mockStore({
        app: { permissionInfos: { user: "bar" }, appBaseUrl: "http://foo.de" },
      });
      const component = render(
        <Provider store={store}>
          <Login />
        </Provider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });
  });
});

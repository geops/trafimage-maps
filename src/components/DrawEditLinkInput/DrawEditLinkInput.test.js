import React from "react";
import { Provider } from "react-redux";

import { render, waitFor } from "@testing-library/react";
import DrawEditLinkInput from ".";

describe("DrawEditLinkInput", () => {
  let store;

  describe("should match snapshot.", () => {
    test("return null if no admin_id value", () => {
      store = global.mockStore({
        map: {},
        app: { i18n: global.i18n },
      });
      const { container } = render(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
      expect(container.innerHTML).toBe("");
    });
  });

  test("display input text with the draw edit link", async () => {
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, drawEditLink: "http://foo.ch" },
    });
    const { container } = render(
      <Provider store={store}>
        <DrawEditLinkInput />
      </Provider>,
    );
    await waitFor(() => container.querySelector("input").value);
    expect(container.querySelector("input").value).toBe("http://foo.ch");
  });
});

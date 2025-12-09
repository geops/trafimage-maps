import React from "react";
import { Provider } from "react-redux";

import { fireEvent, render } from "@testing-library/react";
import { ReactComponent as PencilAdd } from "../../img/pencil_add.svg";
import DrawButton from ".";

describe("DrawButton", () => {
  const store = global.mockStore({
    map: {},
    app: { i18n: global.i18n, mapsetUrl: "foo.mapset.ch" },
  });

  test("display basic default icon.", () => {
    const { container } = render(
      <Provider store={store}>
        <DrawButton />
      </Provider>,
    );
    expect(container.querySelectorAll("svg").length).toBe(1);
  });

  test("display children instead of default icon.", () => {
    const { container } = render(
      <Provider store={store}>
        <DrawButton>
          <PencilAdd />
        </DrawButton>
      </Provider>,
    );
    expect(container.querySelectorAll("svg").length).toBe(1);
  });

  test("open new window to mapset with an encoded string representing the current url.", () => {
    const { container } = render(
      <Provider store={store}>
        <DrawButton />
      </Provider>,
    );
    global.window.open = jest.fn();
    fireEvent.click(container.querySelector("button"), {
      target: { name: "width", value: 50 },
    });
    expect(global.window.open).toBeCalledWith(
      "foo.mapset.ch?parent=http%3A%2F%2Flocalhost%2F",
      "_self",
    );
  });
});

import React from "react";
import { Provider } from "react-redux";

import OLMap from "ol/Map";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import DrawMenu from "./DrawMenu";
import theme from "../../themes/default";

describe("DrawMenu", () => {
  let store;
  test("should use MenuItem and display Draw", () => {
    const info = {
      key: "foo",
      elements: {
        drawMenu: true,
      },
    };
    store = global.mockStore({
      map: {},
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        activeTopic: info,
        map: new OLMap(),
        menuOpen: true,
      },
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <DrawMenu />
        </Provider>
      </ThemeProvider>,
    );

    expect(container.querySelectorAll(".wkp-menu-item").length).toBe(1);
    expect(
      container.querySelectorAll(".wkp-menu-item-header-title")[0].textContent,
    ).toBe("Zeichnen auf der Karte");
    expect(container.querySelectorAll("button").length).toBe(4);
  });
});

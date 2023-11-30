import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import Map from "ol/Map";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import Footer from ".";

const dfltStore = {
  map: {},
  app: {
    map: new Map({}),
    projection: {
      label: "WGS 84",
      value: "EPSG:4326",
      format: (c) => c,
    },
  },
};
describe("Footer", () => {
  test("renders default elements", () => {
    const store = global.mockStore({ ...dfltStore });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Footer />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.querySelector("select").textContent).toBe(
      "CH1903 / LV03CH1903+ / LV95Web MercatorWGS 84",
    );
    expect(container.querySelector("a").textContent).toBe("Developer Portal");
    expect(container.querySelectorAll("button")[0].textContent).toBe("Kontakt");
    expect(container.querySelectorAll("button")[1].textContent).toBe(
      "Impressum",
    );
    expect(container.querySelectorAll("button")[2].textContent).toBe(
      "Rechtliches",
    );
  });

  test("renders cookies settings link if consentGiven is true", () => {
    const store = global.mockStore({
      ...dfltStore,
      app: {
        ...dfltStore.app,
        consentGiven: true,
      },
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Footer />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.querySelectorAll("button")[0].textContent).toBe(
      "Cookie-Einstellungen",
    );
  });
});

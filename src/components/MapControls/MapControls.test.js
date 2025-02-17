import React from "react";
import { render } from "@testing-library/react";
import { Map, View } from "ol";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import theme from "../../themes/default";
import MapControls from ".";

let map;
let mapElement;

describe("MapControls", () => {
  beforeEach(() => {
    mapElement = document.createElement("div");
    mapElement.tabIndex = 1;
    document.body.appendChild(mapElement);
    map = new Map({
      target: mapElement,
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
  });

  afterEach(() => {
    document.body.removeChild(mapElement);
  });

  test("should display all buttons by default", () => {
    const store = global.global.mockStore({
      app: { map },
    });
    const { container, getByTestId, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MapControls />
        </Provider>
      </ThemeProvider>,
    );
    expect(queryByTestId("map-controls-menu-toggler")).toBeNull();
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(getByTestId("map-controls-geolocation")).toBeTruthy();
    expect(getByTestId("map-controls-fit-extent")).toBeTruthy();
  });

  test("should not display geolocation", () => {
    const store = global.global.mockStore({
      app: { map },
    });
    const { container, queryByTestId, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MapControls map={map} geolocation={false} />
        </Provider>
      </ThemeProvider>,
    );
    expect(queryByTestId("map-controls-menu-toggler")).toBeNull();
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(queryByTestId("map-controls-geolocation")).toBeNull();
    expect(getByTestId("map-controls-fit-extent")).toBeTruthy();
  });

  test("should not display fitExtent", () => {
    const store = global.global.mockStore({
      app: { map },
    });
    const { container, getByTestId, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MapControls map={map} fitExtent={false} />
        </Provider>
      </ThemeProvider>,
    );
    expect(queryByTestId("map-controls-menu-toggler")).toBeNull();
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(getByTestId("map-controls-geolocation")).toBeTruthy();
    expect(queryByTestId("map-controls-fit-extent")).toBeNull();
  });

  test("should not display zoomSlider", () => {
    const store = global.global.mockStore({
      app: { map },
    });
    const { container, getByTestId, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MapControls map={map} />,
        </Provider>
      </ThemeProvider>,
    );
    expect(queryByTestId("map-controls-menu-toggler")).toBeNull();
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoomslider-wrapper").length).toBe(0);
    expect(getByTestId("map-controls-geolocation")).toBeTruthy();
    expect(getByTestId("map-controls-fit-extent")).toBeTruthy();
  });

  test("should display menuToggler", () => {
    const store = global.global.mockStore({
      app: { map },
    });
    const { container, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <MapControls map={map} menuToggler />,
        </Provider>
      </ThemeProvider>,
    );
    expect(getByTestId("map-controls-menu-toggler")).toBeTruthy();
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(getByTestId("map-controls-geolocation")).toBeTruthy();
    expect(getByTestId("map-controls-fit-extent")).toBeTruthy();
  });
});

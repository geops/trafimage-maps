import React from "react";
import { render } from "@testing-library/react";
import { Map, View } from "ol";
import { Provider } from "react-redux";
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
    const store = global.mockStore({
      app: { map },
    });
    const { container } = render(
      <Provider store={store}>
        <MapControls />,
      </Provider>,
    );
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoomslider-wrapper").length).toBe(1);
    expect(container.querySelectorAll(".wkp-geolocation svg").length).toBe(1);
    expect(container.querySelectorAll(".wkp-fit-extent svg").length).toBe(1);
  });

  test("should not display geolocation", () => {
    const store = global.mockStore({
      app: { map },
    });
    const { container } = render(
      <Provider store={store}>
        <MapControls map={map} geolocation={false} />,
      </Provider>,
    );
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoomslider-wrapper").length).toBe(1);
    expect(container.querySelectorAll(".wkp-geolocation svg").length).toBe(0);
    expect(container.querySelectorAll(".wkp-fit-extent svg").length).toBe(1);
  });

  test("should not display fitExtent", () => {
    const store = global.mockStore({
      app: { map },
    });
    const { container } = render(
      <Provider store={store}>
        <MapControls map={map} fitExtent={false} />,
      </Provider>,
    );
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoomslider-wrapper").length).toBe(1);
    expect(container.querySelectorAll(".wkp-geolocation svg").length).toBe(1);
    expect(container.querySelectorAll(".wkp-fit-extent svg").length).toBe(0);
  });

  test("should not display zoomSlider", () => {
    const store = global.mockStore({
      app: { map },
    });
    const { container } = render(
      <Provider store={store}>
        <MapControls map={map} zoomSlider={false} />,
      </Provider>,
    );
    expect(container.querySelectorAll(".rs-zoom-in svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoom-out svg").length).toBe(1);
    expect(container.querySelectorAll(".rs-zoomslider-wrapper").length).toBe(0);
    expect(container.querySelectorAll(".wkp-geolocation svg").length).toBe(1);
    expect(container.querySelectorAll(".wkp-fit-extent svg").length).toBe(1);
  });
});

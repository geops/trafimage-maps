import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";

import { Feature } from "ol";
import { Polygon } from "ol/geom";
import NetzkartePopup from ".";

describe("NetzkartePopup", () => {
  let store;

  beforeEach(() => {
    store = global.mockStore({
      map: {},
      app: {
        projection: { value: "EPSG:3857" },
        language: "de",
      },
    });
  });

  test("displays only coordinates menu by default", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(container.querySelector('[role="button"]').textContent).toBe(
      "Koordinaten",
    );
  });

  test("displays airport label.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("layer", " flug");
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(container.querySelector(".wkp-netzkarte-popup").textContent).toBe(
      " flugKoordinatenLänge (X): 3Breite (Y): 3",
    );
  });

  ["url_interactive_plan", "url_a4", "url_poster", "url_shopping"].forEach(
    (property) => {
      test(`displays plan link if ${property} exists.`, () => {
        const feature = new Feature(
          new Polygon([
            [
              [2, 2],
              [3, 3],
              [4, 4],
            ],
          ]),
        );
        feature.set(property, "foo");
        const { container } = render(
          <Provider store={store}>
            <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
          </Provider>,
        );
        expect(container.querySelector("a.wkp-popup-plans").textContent).toBe(
          "Bahnhofpläne",
        );
      });
    },
  );

  test("displays bep link if url_bep is available.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("url_bep", "url_bep");
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(
      container.querySelector('a[href="url_bep"][target="_blank"]').textContent,
    ).toBe(" url_bepLink.svg");
  });

  test("displays the sbb timetable link if name is available.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("name", "foo");
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(
      container.querySelector(
        'a[href="station_timetable_url"][target="_blank"]',
      ).textContent,
    ).toBe(" FahrplanLink.svg");
  });

  test("displays the departures link if station is in switzerland.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("sbb_id", "8500000");
    render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(screen.getByText("Abfahrtszeiten")).toBeInTheDocument();
  });

  test("doesn't display the departures link if station is outside switzerland.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("sbb_id", "8500");
    render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(screen.queryByText("Abfahrtszeiten")).toBe(null);
  });

  test("displays the station service link if if station is in Switzerland and layer (only railway) is available.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("sbb_id", "8500000");
    feature.set("rail", 1);
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(
      container.querySelector('a[href="station_service_url"][target="_blank"]')
        .textContent,
    ).toBe(" Webseite BahnhofLink.svg");
  });

  test("doesn't display the station service link if station outside CH.", () => {
    const feature = new Feature(
      new Polygon([
        [
          [2, 2],
          [3, 3],
          [4, 4],
        ],
      ]),
    );
    feature.set("sbb_id", "85000");
    feature.set("rail", 1);
    const { container } = render(
      <Provider store={store}>
        <NetzkartePopup feature={feature} coordinate={[2.5, 2.5]} />
      </Provider>,
    );
    expect(
      container.querySelectorAll('a[href="station_service_url"]').length,
    ).toBe(0);
  });
});

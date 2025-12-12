import React from "react";
import { render } from "@testing-library/react";
import { Feature, Map, View } from "ol";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { MatomoProvider } from "@jonkoops/matomo-tracker-react";
import RailplusLayer from "../../layers/RailplusLayer";
import theme from "../../themes/default";
import RailplusPopup from "./RailplusPopup";

describe("RailplusPopup", () => {
  const feature1 = new Feature({
    isb_tu_nummer: 1,
  });
  const feature33 = new Feature({
    isb_tu_nummer: 33,
  });
  const layer = new RailplusLayer();
  layer.railplusProviders = {
    1: {
      long_name: "Foooooooo",
      location_headquarter: "Some Street/nSome Town/nSome Country",
      logo: "some-logo-data-url",
      picture: "some-picture-data-url",
      name: "Bar",
      cantons: ["BE", "SO"],
      highest_point: "100",
      lowest_point: "10",
      number_of_employees: "15000",
      yearly_number_of_passengers: "265000",
      route_length: "20km",
    },
    33: {
      long_name: "Fiiizzzzz",
      name: "FIZ",
      cantons: [],
      highest_point: "100",
      route_length: "20km",
    },
  };
  let mapElement;
  let map;
  let store;
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
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, map },
    });
  });

  it("renders correctly with complete data", () => {
    const { queryByTestId, getAllByTestId } = render(
      <MatomoProvider value={{}}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <RailplusPopup layer={layer} feature={feature1} />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    expect(queryByTestId("railplus-logo")).toBeTruthy();
    expect(queryByTestId("railplus-longname")).toBeTruthy();
    expect(queryByTestId("railplus-address")).toBeTruthy();
    expect(queryByTestId("carousel-photo")).toBeTruthy();
    expect(queryByTestId("railplus-cantons")).toBeTruthy();
    expect(queryByTestId("railplus-cantons-list")).toBeTruthy();
    expect(getAllByTestId(/railplus-cantons-listitem/)).toHaveLength(2);
    expect(queryByTestId("railplus-cantons-listitem-so")).toBeTruthy();
    expect(queryByTestId("railplus-highest")).toBeTruthy();
    expect(queryByTestId("railplus-lowest")).toBeTruthy();
    expect(queryByTestId("railplus-employees")).toBeTruthy();
    expect(queryByTestId("railplus-passengers")).toBeTruthy();
    expect(queryByTestId("railplus-route")).toBeTruthy();
  });
  it("renders correctly with incomplete data", () => {
    const { queryByTestId } = render(
      <MatomoProvider value={{}}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <RailplusPopup layer={layer} feature={feature33} />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    expect(queryByTestId("railplus-logo")).toBeFalsy();
    expect(queryByTestId("railplus-longname")).toBeTruthy();
    expect(queryByTestId("railplus-address")).toBeFalsy();
    expect(queryByTestId("carousel-photo")).toBeFalsy();
    expect(queryByTestId("railplus-cantons")).toBeFalsy();
    expect(queryByTestId("railplus-highest")).toBeTruthy();
    expect(queryByTestId("railplus-lowest")).toBeFalsy();
    expect(queryByTestId("railplus-employees")).toBeFalsy();
    expect(queryByTestId("railplus-passengers")).toBeFalsy();
    expect(queryByTestId("railplus-route")).toBeTruthy();
  });
});

import React from "react";
import { Provider } from "react-redux";
import { render, waitFor } from "@testing-library/react";
import fetchMock from "fetch-mock";
import { Feature } from "ol";
import StopPlacePopup from ".";

const cartaroUrl = "https://cartaro.foo.com/";
describe("StopPlacePopup", () => {
  let store;

  beforeEach(() => {
    jest.resetModules();
    store = global.mockStore({
      map: {},
      app: { i18n: global.i18n, cartaroUrl, language: "de" },
    });
  });
  afterEach(() => {
    fetchMock.restore();
  });

  test("displays all infos", async () => {
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        alternativeTransport: {
          state: "YES",
        },
        accessibility: {
          state: "NO",
        },
        passengerInformation: {
          staticOpticState: "UNKNOWN",
          dynamicOpticState: "YES",
          acousticState: "YES",
        },
        url: "www.bls.ch",
        note: {
          de: "Shuttle",
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "bar" })} />
      </Provider>,
    );

    await waitFor(() => {
      spy.called();
    });
    expect(queryByTestId("stopplace-accessibility")).toBeTruthy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeTruthy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeTruthy();
    expect(queryByTestId("stopplace-note")).toBeTruthy();
    expect(queryByTestId("stopplace-url")).toBeTruthy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays accessibility box with Ja and with note", async () => {
    const note = "Very important information for people with disabilities";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        accessibility: {
          state: "YES",
          note: {
            de: note,
          },
        },
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "foo" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeTruthy();
    expect(queryByText("Ja")).toBeTruthy();
    expect(queryByText(note)).toBeTruthy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays alternative-transport box with only note when state = PARTIALLY", async () => {
    const note =
      "Very important information for people with disabilities for alternative transport";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        alternativeTransport: {
          state: "PARTIALLY",
          note,
        },
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "blu" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeTruthy();
    expect(queryByText("Teilweise")).toBeFalsy();
    expect(queryByText(note)).toBeTruthy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays alternative-transport box with Shuttle-Fahrdienst when state = YES and no note is defined", async () => {
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        alternativeTransport: {
          state: "YES",
        },
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "fimo" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeTruthy();
    expect(queryByTestId("stopplace-alternative-transport-state")).toBeTruthy();
    expect(queryByText("Shuttle-Fahrdienst")).toBeTruthy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  ["NO", "UNKNOWN", "NOT_APPLICABLE"].forEach((state) => {
    test(`displays alternative-transport box when value is ${state} but there is a note`, async () => {
      const note = "Very important information for people with disabilities";
      const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
        prmInformation: {
          alternativeTransport: {
            state,
            note,
          },
        },
      });

      const { queryByTestId, queryByText } = render(
        <Provider store={store}>
          <StopPlacePopup feature={new Feature({ uic: `show-${state}` })} />
        </Provider>,
      );

      await waitFor(() => {
        return spy.called();
      });

      expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
      expect(queryByTestId("stopplace-alternative-transport")).toBeTruthy();
      expect(
        queryByTestId("stopplace-alternative-transport-state"),
      ).toBeFalsy();
      expect(
        queryByTestId("stopplace-alternative-transport-note"),
      ).toBeTruthy();
      expect(queryByText(note)).toBeTruthy();
      expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
      expect(queryByTestId("stopplace-note")).toBeFalsy();
      expect(queryByTestId("stopplace-url")).toBeFalsy();
      expect(queryByTestId("stopplace-announcer")).toBeTruthy();
    });
  });

  ["NO", "UNKNOWN", "NOT_APPLICABLE", "PARTIALLY"].forEach((state) => {
    test(`displays no alternative-transport box when value is ${state} without note`, async () => {
      const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
        prmInformation: {
          alternativeTransport: {
            state,
          },
        },
      });

      const { queryByTestId } = render(
        <Provider store={store}>
          <StopPlacePopup feature={new Feature({ uic: `hide-${state}` })} />
        </Provider>,
      );

      await waitFor(() => {
        return spy.called();
      });

      expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
      expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
      expect(
        queryByTestId("stopplace-alternative-transport-state"),
      ).toBeFalsy();
      expect(queryByTestId("stopplace-alternative-transport-note")).toBeFalsy();
      expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
      expect(queryByTestId("stopplace-note")).toBeFalsy();
      expect(queryByTestId("stopplace-url")).toBeFalsy();
      expect(queryByTestId("stopplace-announcer")).toBeTruthy();
    });
  });

  test("only displays accessibility box with Nein and with note", async () => {
    const note = "Very important information for people with disabilities";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        accessibility: {
          state: "NO",
          note,
        },
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "bli" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeTruthy();
    expect(queryByText("Nein")).toBeTruthy();
    expect(queryByText(note)).toBeTruthy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays passengerinfo box with dynamicOpticStyte only", async () => {
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        passengerInformation: {
          staticOpticState: "UNKNOWN",
          dynamicOpticState: "YES",
          acousticState: "NO",
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "fizz" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-dynamicOpticState"),
    ).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-staticOpticState"),
    ).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo-acousticState")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("doesn't display passengerinfo box when all states NO or UNKNOWN", async () => {
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        passengerInformation: {
          staticOpticState: "UNKNOWN",
          dynamicOpticState: "NO",
          acousticState: "NO",
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "fake" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo-acousticState")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays Link", async () => {
    const url = "www.foo.bar";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        url,
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "buzz" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeTruthy();
    expect(queryByText(url)).toBeTruthy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays note (string)", async () => {
    const note = "Very important information for people with disabilities";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        note,
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={store}>
        <StopPlacePopup feature={new Feature({ uic: "bla" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeTruthy();
    expect(queryByText(note)).toBeTruthy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("only displays note (object)", async () => {
    const note = "Sehr wichtige Informationen für Menschen mit Behinderungen";
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        note: { de: note },
      },
    });
    const newStore = global.mockStore({
      map: {},
      app: { i18n: global.i18n, cartaroUrl },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={newStore}>
        <StopPlacePopup feature={new Feature({ uic: "thingy" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeTruthy();
    expect(queryByText(note)).toBeTruthy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });

  test("displays no data message when all values are falsy", async () => {
    const spy = fetchMock.once(new RegExp(cartaroUrl, "g"), {
      prmInformation: {
        alternativeTransport: undefined,
        accessibility: undefined,
        url: undefined,
        passengerInformation: {
          staticOpticState: "UNKNOWN",
          dynamicOpticState: "NO",
          acousticState: "NO",
        },
        note: undefined,
      },
    });
    const newStore = global.mockStore({
      map: {},
      app: { i18n: global.i18n, cartaroUrl },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={newStore}>
        <StopPlacePopup feature={new Feature({ uic: "other" })} />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeFalsy();
    expect(queryByTestId("stopplace-alternative-transport")).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo")).toBeFalsy();
    expect(queryByTestId("stopplace-note")).toBeFalsy();
    expect(queryByTestId("stopplace-url")).toBeFalsy();
    expect(queryByText("Keine Daten für diese Station")).toBeTruthy();
    expect(queryByTestId("stopplace-announcer")).toBeTruthy();
  });
});

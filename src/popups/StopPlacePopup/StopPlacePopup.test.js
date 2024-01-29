import React from "react";
import { Provider } from "react-redux";
import { render, waitFor } from "@testing-library/react";
import fetchMock from "fetch-mock";
import { Feature } from "ol";
import StopPlacePopup from ".";

const cartaroUrl = "https://cartaro.foo.com";
describe("StopPlacePopup", () => {
  let store;

  beforeEach(() => {
    jest.resetModules();
    store = global.mockStore({
      map: {},
      app: {
        cartaroUrl,
        language: "de",
      },
    });
  });
  afterEach(() => {
    fetchMock.restore();
  });

  test("displays all infos", async () => {
    const cartaroUrlRegex = new RegExp(cartaroUrl, "g");
    const spy = fetchMock.once(cartaroUrlRegex, {
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
        <StopPlacePopup
          feature={
            new Feature({
              uic: "bar",
            })
          }
        />
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
  });

  test("only displays accessibility box with Ja and with note", async () => {
    const cartaroUrlRegex = new RegExp(cartaroUrl, "g");
    const note =
      "Bei diesem Bahnhof benötigen Sie einen Shuttle. Bitte melden Sie sich bis spätestens 2 Stunden vor Abfahrt telefonisch beim Contact Center Handicap täglich 5.00–24.00 Uhr, Telefon 0800 007 102 (kostenlos in der Schweiz), aus dem Ausland +41 800 007 102.";
    const spy = fetchMock.once(cartaroUrlRegex, {
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
        <StopPlacePopup
          feature={
            new Feature({
              uic: "foo",
            })
          }
        />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-accessibility")).toBeTruthy();
    expect(queryByText("Ja")).toBeTruthy();
    expect(queryByText(note)).toBeTruthy();
  });

  test("only displays passengerinfo box with dynamicOpticStyte only", async () => {
    const cartaroUrlRegex = new RegExp(cartaroUrl, "g");
    const spy = fetchMock.once(cartaroUrlRegex, {
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
        <StopPlacePopup
          feature={
            new Feature({
              uic: "fizz",
            })
          }
        />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    expect(queryByTestId("stopplace-passengerinfo")).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-dynamicOpticState"),
    ).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-staticOpticState"),
    ).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo-acousticState")).toBeFalsy();
  });

  test("only displays passengerinfo box with dynamicOpticStyte only", async () => {
    const cartaroUrlRegex = new RegExp(cartaroUrl, "g");
    const spy = fetchMock.once(cartaroUrlRegex, {
      prmInformation: {
        alternativeTransport: {
          state: "YES",
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={store}>
        <StopPlacePopup
          feature={
            new Feature({
              uic: "fizz",
            })
          }
        />
      </Provider>,
    );

    await waitFor(() => {
      return spy.called();
    });

    // expect(queryByTestId("stopplace-alternative-transport")).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-dynamicOpticState"),
    ).toBeTruthy();
    expect(
      queryByTestId("stopplace-passengerinfo-staticOpticState"),
    ).toBeFalsy();
    expect(queryByTestId("stopplace-passengerinfo-acousticState")).toBeFalsy();
  });
});

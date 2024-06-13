import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { Map, View } from "ol";
import { ThemeProvider } from "@mui/material";
import { MatomoProvider } from "@jonkoops/matomo-tracker-react";
import theme from "../../themes/default";
import Share from ".";

describe("Share", () => {
  let store;
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = { hostname: "wkp-dev.foo" };
  beforeEach(() => {
    store = global.global.mockStore({
      map: {},
      app: {
        map: new Map({ view: new View({}) }),
        activeTopic: {
          key: "test",
        },
        language: "de",
        appBaseUrl: "https://maps.trafimage.ch",
      },
    });
  });

  test("should match snapshot.", () => {
    const { container } = render(
      <MatomoProvider value={{}}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Share />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    expect(container.querySelectorAll("button").length).toBe(2);
    expect(container.innerHTML).toMatchSnapshot();
  });

  describe("should send track event on click", () => {
    let matomo;
    let container;

    beforeEach(() => {
      matomo = {
        pushInstruction: jest.fn(),
        trackPageView: jest.fn(),
        trackEvent: jest.fn(),
      };
      const wrapper = render(
        <MatomoProvider value={matomo}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <Share />
            </Provider>
          </ThemeProvider>
        </MatomoProvider>,
      );
      container = wrapper.container;
      window.digitalDataLayer = [];
    });

    test("on permalink button", () => {
      fireEvent.click(container.querySelector(".wkp-permalink-bt button"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickSharePermalink",
        category: "test",
      });
      expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
        /Permalink erstellen/i,
      );
    });

    test("on mail button", () => {
      fireEvent.click(container.querySelector(".ta-mail-icon a"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareMail",
        category: "test",
      });
      expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
        /Per Email versenden/i,
      );
    });

    test("on download button", () => {
      fireEvent.click(container.querySelector(".rs-canvas-save-button"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareDownload",
        category: "test",
      });
      expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
        /PNG export/i,
      );
    });

    test("on facebook button", () => {
      fireEvent.click(container.querySelector(".ta-facebook-icon a"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareFacebook",
        category: "test",
      });
      expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
        /Auf Facebook teilen/i,
      );
    });

    test("on twitter button", () => {
      fireEvent.click(container.querySelector(".ta-twitter-icon a"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareTwitter",
        category: "test",
      });
      expect(window.digitalDataLayer[0].event.eventInfo.variant).toMatch(
        /Auf Twitter teilen/i,
      );
    });
  });
});

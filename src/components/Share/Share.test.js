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
    expect(container.querySelectorAll("a").length).toBe(3);
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
    });

    test("on permalink button", () => {
      fireEvent.click(container.querySelector(".wkp-permalink-bt button"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickSharePermalink",
        category: "test",
      });
    });

    test("on mail button", () => {
      fireEvent.click(container.querySelector(".ta-mail-icon"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareMail",
        category: "test",
      });
    });

    test("on download button", () => {
      fireEvent.click(container.querySelector(".rs-canvas-save-button"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareDownload",
        category: "test",
      });
    });

    test("on facebook button", () => {
      fireEvent.click(container.querySelector(".ta-facebook-icon"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareFacebook",
        category: "test",
      });
    });

    test("on twitter button", () => {
      fireEvent.click(container.querySelector(".ta-twitter-icon"));
      expect(matomo.trackEvent).toBeCalledWith({
        action: "clickShareTwitter",
        category: "test",
      });
    });
  });
});

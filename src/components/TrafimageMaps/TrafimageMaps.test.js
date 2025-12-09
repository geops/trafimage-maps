import React from "react";
import { createInstance } from "@jonkoops/matomo-tracker-react";
import { render, act } from "@testing-library/react";
import TrafimageMaps from ".";

describe("TrafimageMaps", () => {
  describe("tracking and consent", () => {
    afterEach(() => {
      createInstance.mockClear();
      window.OptanonWrapper = undefined;
    });

    test("disabled", () => {
      render(<TrafimageMaps apiKey="" enableTracking={false} topics={[]} />);
      expect(createInstance).toHaveBeenCalledTimes(0);
      expect(window.OptanonWrapper).toBeUndefined();
    });

    test("enabled by default and active consent mechanism.", () => {
      render(<TrafimageMaps apiKey="" topics={[]} domainConsent=".*" />);
      expect(createInstance).toHaveBeenCalledTimes(1);
      expect(createInstance).toHaveBeenCalledWith({
        siteId: "9",
        trackerUrl: "https://analytics.geops.de/piwik.php",
        urlBase: "https://analytics.geops.de/",
        configurations: {
          setCookieSameSite: "LAX",
        },
      });
      const pushInstr = createInstance.lastInstance.pushInstruction;
      expect(pushInstr).toHaveBeenCalledTimes(1);
      expect(pushInstr).toHaveBeenCalledWith("requireConsent");
      expect(window.OptanonWrapper).toBeDefined();
    });

    test("enabled by default and disable cookies without consent mechanism.", () => {
      render(
        <TrafimageMaps
          apiKey=""
          topics={[]}
          domainConsent=".*"
          disableCookies
        />,
      );
      expect(createInstance).toHaveBeenCalledTimes(1);
      expect(createInstance).toHaveBeenCalledWith({
        siteId: "9",
        trackerUrl: "https://analytics.geops.de/piwik.php",
        urlBase: "https://analytics.geops.de/",
        configurations: {
          setCookieSameSite: "LAX",
        },
      });
      const pushInstr = createInstance.lastInstance.pushInstruction;
      expect(pushInstr).toHaveBeenCalledTimes(4);
      expect(pushInstr).toHaveBeenCalledWith("disableCookies");
      expect(pushInstr).toHaveBeenCalledWith(
        "setCustomUrl",
        "http://localhost/",
      );
      expect(pushInstr).toHaveBeenCalledWith("setDocumentTitle", "");
      expect(pushInstr).toHaveBeenCalledWith("trackPageView");
      expect(window.OptanonWrapper).toBeUndefined();
    });

    describe("OptanonWrapper callback .", () => {
      // let store;
      let optW;

      beforeEach(() => {
        render(
          <TrafimageMaps
            apiKey=""
            enableTracking
            topics={[]}
            domainConsent=".*"
          />,
        );
        optW = window.OptanonWrapper;
        expect(window.Optanon).toBeUndefined();
        expect(optW).toBeDefined();
      });

      afterEach(() => {
        window.Optanon = undefined;
        window.OptanonWrapper = undefined;
        window.OptanonActiveGroups = undefined;
      });

      test("does nothing if Optanon is undefined.", () => {
        expect(optW()).toBe(undefined);
        // TODO find a way to test this with testing-library
        // expect(store.dispatch).toHaveBeenCalledTimes(0);
      });

      test("does nothing if IsAlertBoxClosed return false.", () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return false;
          },
        };
        expect(optW()).toBe(undefined);
        // TODO find a way to test this with testing-library
        // expect(store.dispatch).toHaveBeenCalledTimes(0);
      });

      test("dispatches only consentGiven if IsAlertBoxClosed return true and C002 group is allowed", () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return true;
          },
        };
        window.OptanonActiveGroups = "C0001,C0002,C0003";
        act(() => {
          expect(optW()).toBe(undefined);
        });
        // TODO find a way to test this with testing-library
        // expect(store.dispatch).toHaveBeenCalledTimes(1);
        // expect(store.dispatch).toHaveBeenCalledWith({
        //   data: true,
        //   type: 'SET_CONSENT_GIVEN',
        // });
      });

      test("dispatches consentGiven and disbleCookies if IsAlertBoxClosed return true and C002 group is not allowed", () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return true;
          },
        };
        window.OptanonActiveGroups = "C0001,C0004,C0203";
        act(() => {
          expect(optW()).toBe(undefined);
        });
        // TODO find a way to test this with testing-library
        // expect(store.dispatch).toHaveBeenCalledTimes(2);
        // expect(store.dispatch.mock.calls[0][0]).toEqual({
        //   data: true,
        //   type: 'SET_DISABLE_COOKIES',
        // });
        // expect(store.dispatch.mock.calls[1][0]).toEqual({
        //   data: true,
        //   type: 'SET_CONSENT_GIVEN',
        // });
      });
    });
  });
});

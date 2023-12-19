import {
  convertToOldZoom,
  zoomEquivalent,
  convertUrlParams,
  redirect,
  redirectToLogin,
  isOpenedByMapset,
} from "./redirectHelper";

describe("redirectHelper", () => {
  describe("#convertToOldZoom()", () => {
    Object.keys(zoomEquivalent).forEach((i) => {
      test(`should get the old wkp zoom form the zoom ${i}`, () => {
        expect(convertToOldZoom(i)).toEqual(zoomEquivalent[i]);
      });
    });

    test(`should get the old wkp zoom before zoom 7`, () => {
      expect(convertToOldZoom(6)).toEqual(1);
    });

    test(`should get the old wkp zoom after zoom 18`, () => {
      expect(convertToOldZoom(19)).toEqual(10);
    });
  });

  describe("#convertUrlParams()", () => {
    test(`should do nothing`, () => {
      expect(convertUrlParams({})).toEqual({});
    });

    test(`should convert x, y and z`, () => {
      expect(convertUrlParams({ x: 500000, y: 500000, z: 9 })).toEqual({
        x: 157865.4413599663,
        y: -4991538.121346417,
        zoom: 2,
      });
    });
  });

  describe("redirects functions", () => {
    const { location } = window;

    beforeAll(() => {
      delete window.location;
      window.location = { href: "test.ch", reload: jest.fn() };
    });

    afterAll(() => {
      window.location = location;
    });

    describe("#redirect()", () => {
      test(`should redirect to the old WKP url`, () => {
        redirect("bar.ch", "fooTopic", { x: 500000, y: 500000, z: 9 });
        expect(window.location.href).toBe(
          "bar.ch/#/fooTopic?x=500000&y=500000&z=9",
        );
      });
    });

    describe("#redirectToLogin()", () => {
      test(`should redirect to the old WKP url`, () => {
        redirectToLogin("bar.ch");
        expect(window.location.href).toBe(
          "bar.ch/login?next=bar.ch%2F%23%2FfooTopic%3Fx%3D500000%26y%3D500000%26z%3D9",
        );
      });
    });
  });

  describe("#isOpenedByMapset()", () => {
    ["editor.dev.mapset.ch", "mapset.ch", "mapset.io"].forEach((referer) => {
      test(`returns true for ${referer}`, () => {
        const originalReferrer = document.referrer;
        Object.defineProperty(document, "referrer", {
          value: referer,
          configurable: true,
        });
        expect(isOpenedByMapset()).toBe(true);
        Object.defineProperty(document, "referrer", {
          value: originalReferrer,
        });
      });
    });

    [null, undefined, "", "trafimage"].forEach((referer) => {
      test(`returns false for ${referer}`, () => {
        expect(isOpenedByMapset()).toBe(false);
        const originalReferrer = document.referrer;
        Object.defineProperty(document, "referrer", {
          value: referer,
          configurable: true,
        });
        expect(isOpenedByMapset()).toBe(false);
        Object.defineProperty(document, "referrer", {
          value: originalReferrer,
        });
      });
    });
  });
});

import isValidUrl from "./isValidUrl";

describe("isValidUrl", () => {
  test("valid URL", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("http://example.com/path?query=123")).toBe(true);
    expect(isValidUrl("http://www.example.com/path?query=123")).toBe(true);
    expect(isValidUrl("https://maps.trafimage.ch")).toBe(true);
    expect(isValidUrl("https://cartaro.trafimage.ch/api/v1/")).toBe(true);
    expect(isValidUrl("https://maps.trafimage.ch/search/v2/destinations")).toBe(
      true,
    );
    expect(isValidUrl("wss://api.geops.io/tracker-v1")).toBe(true);
  });

  test("invalid URL", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("ftp:/invalid-url")).toBe(false);
    expect(isValidUrl("")).toBe(false);
    // eslint-disable-next-line no-script-url
    expect(isValidUrl("javascript:alert(document.domain)://")).toBe(false);
  });
});

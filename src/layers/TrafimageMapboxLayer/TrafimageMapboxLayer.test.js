import TrafimageMapboxLayer from ".";

const flushPromises = () => new Promise(setImmediate);

describe("TrafimageMapboxLayer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should apply transformRequest options when loading a new style", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve({}),
    });
    const transformRequest = jest.fn((url) => ({
      url: `${url}&foo=bar`,
      credentials: "include",
      headers: { Authorization: "Bearer token" },
    }));
    const layer = new TrafimageMapboxLayer({
      name: "Layer",
      url: "https://example.com",
      apiKey: "test",
      apiKeyName: "key",
      style: "style-a",
      mapOptions: {
        transformRequest,
      },
    });

    layer.mbMap = {
      setStyle: jest.fn(),
      once: jest.fn(),
    };

    layer.loadStyle("https://example.com/styles/style-b/style.json?key=test");
    await flushPromises();

    expect(transformRequest).toHaveBeenCalledWith(
      "https://example.com/styles/style-b/style.json?key=test",
      "Style",
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.com/styles/style-b/style.json?key=test&foo=bar",
      expect.objectContaining({
        credentials: "include",
        headers: { Authorization: "Bearer token" },
        signal: expect.any(AbortSignal),
      }),
    );
  });
});

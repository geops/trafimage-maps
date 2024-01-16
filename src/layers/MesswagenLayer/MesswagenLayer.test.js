import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/react";
import MesswagenLayer from "./MesswagenLayer";

const mewa12Data = {
  title: "Mewa 12",
  latitude: 46.945535664,
  longitude: 7.407811307666667,
  info: [
    {
      label: "Datum",
      value: "16.01.2024",
    },
    {
      label: "Zeit",
      value: "09:19:40 UTC",
    },
    {
      label: "Navigation",
      value: "iNAT-RQT",
    },
    {
      label: "Satelliten",
      value: "10",
    },
    {
      label: "Richtung",
      value: "N_HBS",
    },
    {
      label: "V WGI",
      value: "0.0 km/h",
    },
  ],
  gwVersion: "v1.0.1",
};

describe("MesswagenLayer", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it("does not send request if fileName is not set", () => {
    const layer = new MesswagenLayer();
    layer.start();
    expect(fetchMock.calls().length).toBe(0);
    layer.stop();
  });

  it("does not send request if start is not called", () => {
    // eslint-disable-next-line no-unused-vars
    const layer = new MesswagenLayer({ properties: { fileName: "foo" } });
    expect(fetchMock.calls().length).toBe(0);
  });

  it("send a request on start then every second if fileName is set", async () => {
    fetchMock.once(
      "https://trafimage-services1.geops.de/messwagen/foo.json",
      mewa12Data,
    );
    const layer = new MesswagenLayer({ properties: { fileName: "foo" } });
    layer.start();
    expect(fetchMock.calls().length).toBe(1);

    await waitFor(() => {
      expect(layer.olLayer.getSource().getFeatures()?.length).toBe(1);
      expect(
        layer.olLayer
          .getSource()
          .getFeatures()?.[0]
          .getGeometry()
          .getCoordinates(),
      ).toEqual([824633.7826621074, 5933188.633240641]);
    });
    fetchMock.reset();
    fetchMock.once("https://trafimage-services1.geops.de/messwagen/foo.json", {
      ...mewa12Data,
      latitude: 2,
      longitude: 1,
    });

    await waitFor(
      () => {
        expect(layer.olLayer.getSource().getFeatures()?.length).toBe(1);
        expect(
          layer.olLayer
            .getSource()
            .getFeatures()?.[0]
            .getGeometry()
            .getCoordinates(),
        ).toEqual([111319.49079327358, 222684.20850554318]);
      },
      { timeout: 1500 },
    );
    layer.stop();
  });
});

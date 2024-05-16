import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/react";
import RailplusLayer from "./RailplusLayer";
import TrafimageMapboxLayer from "../TrafimageMapboxLayer";

let layer;

describe("RailplusLayer", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe("on load", () => {
    test("should fetch source info and set the tuInfos variable", async () => {
      const spy = fetchMock.once(/data\/ch\.railplus\.meterspurbahnen\.json/g, {
        "geops.railplus.tu_info": {
          1: {
            name: "foo",
          },
        },
      });
      layer = new RailplusLayer({
        mapboxLayer: new TrafimageMapboxLayer({}),
      });
      layer.mapboxLayer = {
        maplibreMap: {
          getStyle: () => {
            return { layers: [] };
          },
        },
      };

      layer.onLoad();
      await waitFor(() => {
        return spy.called();
      });
      expect(layer.railplusProviders["1"].name).toBe("foo");
    });
  });
});

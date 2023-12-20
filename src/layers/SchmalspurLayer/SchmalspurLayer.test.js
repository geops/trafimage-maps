import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/react";
import SchmalspurLayer from "./SchmalspurLayer";
import TrafimageMapboxLayer from "../TrafimageMapboxLayer";

let layer;

describe("SchmalspurLayer", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  describe("on load", () => {
    test("should fetch source info and set the tuInfos variable", async () => {
      const spy = fetchMock.once(/data\/ch\.sbb\.isb\.schmalspur\.json/g, {
        "geops.isb.schmalspur.tu_info": {
          1: {
            logo_url: null,
            long_name: null,
            name: "SBB CFF FFS",
            tu_nummer: "1",
            url_de: "www.sbb.ch/en/networkaccess",
            url_en: "www.sbb.ch/en/networkaccess",
            url_fr: "www.sbb.ch/en/networkaccess",
            url_it: "www.sbb.ch/en/networkaccess",
          },
        },
      });
      layer = new SchmalspurLayer({
        mapboxLayer: new TrafimageMapboxLayer({}),
      });
      layer.mapboxLayer = {
        mbMap: {
          getStyle: () => {
            return { layers: [] };
          },
          getSource: (id) => {
            return { url: `https://foo.ch/data/${id}.json` };
          },
        },
      };

      layer.onLoad();

      await waitFor(() => {
        return spy.called();
      });

      expect(layer.tuInfos["1"].name).toBe("SBB CFF FFS");
    });
  });
});

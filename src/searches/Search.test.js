import { Style } from "ol/style";
import Search from "./Search";

describe("Search", () => {
  describe("#getFeatures()", () => {
    test("applies the highlightStyle on each feature", () => {
      const search = new Search();
      search.highlightStyle = new Style({});
      const feat = search.getFeature({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0],
        },
        properties: {},
      });

      expect(feat.getStyle()).toBe(search.highlightStyle);
    });
  });
});

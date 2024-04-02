import MapboxStyleLayer from "../MapboxStyleLayer";
import PlatformsLayer from "./PlatformsLayer";

describe("PlatformsLayer", () => {
  test("return only one featureInfo to avoid duplicate data in der Popup [TRAFDATA-334]", (done) => {
    const feat1 = { id: "feat1" };
    const feat2 = { id: "feat2" };
    MapboxStyleLayer.prototype.getFeatureInfoAtCoordinate = jest.fn(() =>
      Promise.resolve({
        features: [feat1, feat2],
      }),
    );
    const layer = new PlatformsLayer();
    layer.getFeatureInfoAtCoordinate().then((featureInfo) => {
      expect(featureInfo.features.length).toBe(1);
      expect(featureInfo.features[0]).toBe(feat1);
      done();
    });
  });
});

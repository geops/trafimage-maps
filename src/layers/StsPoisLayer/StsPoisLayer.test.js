import StsPoisLayer from "./StsPoisLayer";

describe("StsPoisLayer", () => {
  test("sets up a correct ol layer", () => {
    const layer = new StsPoisLayer();
    expect(layer.olLayer.getSource().getUrl()).toBe(
      "https://maps.trafimage.ch/sts-static/pois.geojson",
    );
    expect(layer.olLayer.getSource().getFormat().dataProjection.getCode()).toBe(
      "EPSG:4326",
    );
    expect(
      layer.olLayer.getSource().getFormat().defaultFeatureProjection.getCode(),
    ).toBe("EPSG:3857");
  });
});

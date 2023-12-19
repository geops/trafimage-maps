import { Layer } from "mobility-toolbox-js/ol";
import applPermalinkVisiblity from "./applyPermalinkVisibility";

describe("applyPermalinkVisibility", () => {
  test("show/hide layers depending on the layers param", () => {
    const layer1 = new Layer({ key: "layer1", visible: false });
    const layer2 = new Layer({ key: "layer2", visible: true });
    const layer3 = new Layer({ key: "layer3", visible: true });
    const layerHiddenInLayerTree = new Layer({
      key: "layerHiddenInLayerTree",
      properties: { hideInLegend: true },
    });
    const baseLayer = new Layer({
      key: "layerHiddenInLayerTree",
      properties: { isBaseLayer: true },
    });
    window.history.pushState({}, undefined, "/?layers=layer1,layer3");
    applPermalinkVisiblity(
      [layer1, layer2, layer3, layerHiddenInLayerTree, baseLayer],
      () => true,
    );
    expect(layer1.visible).toBe(true);
    expect(layer2.visible).toBe(false);
    expect(layer3.visible).toBe(true);
    expect(layerHiddenInLayerTree.visible).toBe(true);
    expect(baseLayer.visible).toBe(true);
  });

  test("ignores base layers and hidden layer in legend from layers param detection (TRAFKLEIN-726)", () => {
    const layer1 = new Layer({ key: "layer1", visible: true });
    const layer2 = new Layer({ key: "layer2", visible: true });
    const layerHiddenInLayerTree = new Layer({
      key: "layerHiddenInLayerTree",
      properties: { hideInLegend: true },
    });
    const baseLayer = new Layer({
      key: "layerHiddenInLayerTree",
      properties: { isBaseLayer: true },
    });
    window.history.pushState({}, undefined, "/?layers=");
    applPermalinkVisiblity(
      [layer1, layer2, layerHiddenInLayerTree, baseLayer],
      () => true,
    );
    expect(layer1.visible).toBe(false);
    expect(layer2.visible).toBe(false);
    expect(layerHiddenInLayerTree.visible).toBe(true);
    expect(baseLayer.visible).toBe(true);
  });
});

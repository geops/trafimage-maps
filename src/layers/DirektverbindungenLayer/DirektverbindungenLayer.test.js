import { Layer } from "mobility-toolbox-js/ol";
import OLMap from "ol/Map";
import DirektverbindungenLayer from "./DirektverbindungenLayer";

describe("DirektverbindungenLayer", () => {
  test("should become visible when night or day layer are hidden then day layer becomes visible", () => {
    const map = new OLMap({});
    const layer = new DirektverbindungenLayer({
      visible: false,
      properties: {
        dayLayer: new Layer({ visible: false, apiKey: "day" }),
        nightLayer: new Layer({ visible: false, apiKey: "night" }),
      },
    });

    // Listen day/night layer events
    layer.attachToMap(map);

    expect(layer.visible).toBe(false);
    layer.get("dayLayer").visible = true;
    expect(layer.visible).toBe(true);
  });
});

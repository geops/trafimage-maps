import RegionenkarteLayer from "./RegionenkarteLayer";
import TrafimageMapboxLayer from "../TrafimageMapboxLayer";

describe("RegionenkarteLayer", () => {
  let highlightLayer;
  let layer;
  let filter;
  beforeEach(() => {
    highlightLayer = {
      id: "anlagenverantwortliche.lines.select",
      layout: {
        "line-cap": "round",
        "line-join": "round",
        visibility: "none",
      },
      paint: {
        "line-color": [
          "case",
          ["==", ["get", "region"], "Ost"],
          "#81c784",
          ["==", ["get", "region"], "Mitte"],
          "#d2b3fa",
          ["==", ["get", "region"], "West"],
          "#ffeb3b",
          ["==", ["get", "region"], "Süd"],
          "#ff9a68",
          "#00ff00",
        ],
        "line-width": 13,
      },
      source: "ch.sbb.anlagenverantwortliche",
      "source-layer": "ch.sbb.anlagenverantwortliche",
      type: "line",
    };
    layer = new RegionenkarteLayer({
      mapboxLayer: new TrafimageMapboxLayer({}),
    });
    layer.mapboxLayer = {
      maplibreMap: {
        getLayer: (layerId) => {
          return layer.mapboxLayer.maplibreMap
            .getStyle()
            .layers.find((l) => l.id === layerId);
        },
        getStyle: () => {
          return { layers: [highlightLayer] };
        },
        setFilter: (layerId, filterr) => {
          layer.mapboxLayer.maplibreMap.getLayer(layerId).filter = filterr;
        },
        setLayoutProperty: (layerId, property, value) => {
          layer.mapboxLayer.maplibreMap.getLayer(layerId).layout[property] =
            value;
        },
      },
    };
    filter = ["==", "foo", { bar: "baz" }];
    layer.setHighlightFilter(filter);
  });
  test("setHighlightFilter() should apply filter to highlightlayer", async () => {
    expect(highlightLayer.filter).toBe(filter);
    expect(highlightLayer.layout.visibility).toBe("visible");
  });
  test("select() should not push any features to selectedFeatures or highlightedFeatures", async () => {
    expect(layer.selectedFeatures.length).toBe(0);
    expect(layer.highlightedFeatures.length).toBe(0);
  });
});

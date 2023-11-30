import OLVectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Stroke, Text, Fill } from "ol/style";
import CasaLayer from "./CasaLayer";

const feature = new Feature({
  geometry: new Point([50, 50]),
  zone: 42,
});

const olLayer = new OLVectorLayer({
  source: new VectorSource({
    features: [feature],
  }),
});

let layer;
let map;
let onClick;
let onMouseOver;

describe("CasaLayer", () => {
  beforeEach(() => {
    onClick = jest.fn();
    onMouseOver = jest.fn();
    layer = new CasaLayer({
      name: "Layer",
      olLayer,
      onClick,
      onMouseOver,
    });
    map = new Map({ view: new View({ resution: 5 }) });
    layer.attachToMap(map);
  });

  test("should convert a style to an object.", () => {
    const style = {
      stroke: {
        color: "rgb(255, 200, 25)",
        width: 2,
      },
      hoverStyles: {
        outline: {
          color: "white",
          width: 8,
        },
        background: {
          color: "black",
          width: 4,
        },
      },
      fill: {
        color: "rgb(255, 200, 25)",
      },
      text: {
        font: "12px Arial",
        color: "black",
        label: "zone",
      },
      textOutline: {
        width: 2,
        color: "white",
      },
    };

    const olStyles = layer.getOlStylesFromObject(style);

    expect(olStyles.base).toEqual(
      new Style({
        stroke: new Stroke({
          color: "rgb(255, 200, 25)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgb(255, 200, 25)",
        }),
      }),
    );

    // outline
    expect(olStyles.outline).toEqual(
      new Style({
        stroke: new Stroke({
          width: 8,
          color: "white",
        }),
      }),
    );

    // background
    expect(olStyles.background).toEqual(
      new Style({
        stroke: new Stroke({
          width: 4,
          color: "black",
        }),
      }),
    );

    // text
    expect(olStyles.text).toEqual(
      new Style({
        text: new Text({
          font: "12px Arial",
          text: "zone",
          fill: new Fill({
            color: "black",
          }),
          stroke: new Stroke({
            color: "white",
            width: 2,
          }),
        }),
      }),
    );
  });

  test("should call onMouseOver callback.", async () => {
    const coordinate = [50, 50];
    jest.spyOn(map, "forEachFeatureAtPixel").mockReturnValue(feature);
    const spy = jest.fn();
    layer.onMouseOver(spy);
    await map.dispatchEvent({ type: "pointermove", map, coordinate });

    expect(onMouseOver).toHaveBeenCalledWith(feature, coordinate);
    expect(spy).toHaveBeenCalledWith(feature, coordinate);
  });
});

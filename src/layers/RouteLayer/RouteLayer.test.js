import 'jest-canvas-mock';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke } from 'ol/style';
import RouteLayer from './RouteLayer';

const feature = new Feature({
  geometry: new LineString([
    [50, 50],
    [50, 10],
  ]),
  mot: 'rail',
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

describe('RouteLayer', () => {
  beforeEach(() => {
    onClick = jest.fn();
    onMouseOver = jest.fn();
    layer = new RouteLayer({
      name: 'Layer',
      olLayer,
      onClick,
      onMouseOver,
    });
    map = new Map({ view: new View({ resution: 5 }) });
    layer.init(map);
  });

  test('should return the correct default style.', () => {
    const style = layer.defaultStyleFunction(feature);
    const olStyles = layer.getOlStylesFromObject(style, false, false, feature);

    expect(olStyles.base).toEqual(
      new Style({
        stroke: new Stroke({
          color: [235, 0, 0, 0.5],
          width: 6,
        }),
      }),
    );
  });

  test('should return the correct hover style', () => {
    const style = layer.defaultStyleFunction(feature, false, true);
    const olStyles = layer.getOlStylesFromObject(style, false, true, feature);

    expect(olStyles.base).toEqual(
      new Style({
        zIndex: 1,
        stroke: new Stroke({
          color: [235, 0, 0, 1],
          width: 6,
        }),
      }),
    );

    expect(olStyles.outline).toEqual(
      new Style({
        zIndex: 1,
        stroke: new Stroke({
          color: 'black',
          width: 8,
        }),
      }),
    );
  });
});

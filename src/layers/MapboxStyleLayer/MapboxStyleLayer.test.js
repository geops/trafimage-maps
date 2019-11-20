import 'jest-canvas-mock';
import Map from 'ol/Map';
import View from 'ol/View';
import mapboxgl from 'mapbox-gl';
import TrafimageMapboxLayer from '../TrafimageMapboxLayer';
import MapboxStyleLayer from '.';

let source;
let layer;
let map;

const styleLayer = {
  id: 'netzkarte_point',
  type: 'circle',
  source: 'base',
  'source-layer': 'netzkarte_point',
  paint: {
    'circle-radius': 10,
    'circle-color': 'rgb(0, 61, 155)',
    'circle-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.5,
      0,
    ],
  },
};

describe('MapboxStyleLayer', () => {
  beforeEach(() => {
    source = new TrafimageMapboxLayer({
      name: 'Layer',
    });
    layer = new MapboxStyleLayer({
      name: 'ch.sbb.netzkarte.stationen',
      visible: true,
      mapboxLayer: source,
      styleLayer,
      properties: {
        hideInLegend: true,
        popupComponent: 'NetzkartePopup',
      },
    });
    map = new Map({
      target: document.createElement('div'),
      view: new View({ center: [0, 0] }),
    });
  });

  test('should be instanced.', () => {
    expect(layer).toBeInstanceOf(MapboxStyleLayer);
    expect(layer.styleLayers[0]).toBe(styleLayer);
  });

  test('should not initalized mapbox map.', () => {
    layer.init();
    expect(layer.mbMap).toBe();
  });

  test('should initalized mapbox map.', () => {
    source.init(map);
    expect(source.mbMap).toBeInstanceOf(mapboxgl.Map);
  });

  test('should called terminate on initalization.', () => {
    const spy = jest.spyOn(layer, 'terminate');
    layer.init();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should return a promise resolving features.', async () => {
    layer.init(map);
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    expect(data.coordinate).toEqual([50, 50]);
    expect(data.features).toEqual([]);
    expect(data.layer).toBeInstanceOf(MapboxStyleLayer);
  });
});

import Map from 'ol/Map';
import View from 'ol/View';
import mapboxgl from 'mapbox-gl';
import TrafimageMapboxLayer from '../TrafimageMapboxLayer';
import MapboxStyleLayer from '.';

let source;
let layer;
let map;

const styleLayer = {
  id: 'layer',
};

const mockFetchPromise = Promise.resolve({
  json: () => Promise.resolve({}),
});

describe('MapboxStyleLayer', () => {
  beforeEach(() => {
    source = new TrafimageMapboxLayer({
      name: 'Layer',
      url: 'http://foo.com/styles',
      apiKey: 'test',
    });
    layer = new MapboxStyleLayer({
      name: 'mapbox layer',
      visible: true,
      mapboxLayer: source,
      styleLayer,
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
    layer.attachToMap();
    expect(layer.mbMap).toBe();
  });

  test('should initalized mapbox map.', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
    source.attachToMap(map);
    await source.loadMbMap();
    layer.attachToMap(map);
    expect(layer.mapboxLayer.mbMap).toBeInstanceOf(mapboxgl.Map);
  });

  test('should called detachFromMap on initalization.', () => {
    const spy = jest.spyOn(layer, 'detachFromMap');
    layer.attachToMap();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should return coordinates, features and a layer instance.', async () => {
    source.attachToMap(map);
    layer.attachToMap(map);
    const data = await layer.getFeatureInfoAtCoordinate([50, 50]);
    expect(data.coordinate).toEqual([50, 50]);
    expect(data.features).toEqual([]);
    expect(data.layer).toBeInstanceOf(MapboxStyleLayer);
  });
});

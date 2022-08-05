import { Feature, Map, View } from 'ol';
import { MapboxStyleLayer } from 'mobility-toolbox-js/ol';
import GeltungsbereicheLayer from '.';

describe('GeltungsbereicheLayer', () => {
  test('should return all features (topic NON BETA)', async () => {
    const feat50 = new Feature({ valid_ga_hta: 50 });
    const feat100 = new Feature({ valid_ga_hta: 100 });
    MapboxStyleLayer.prototype.getFeatureInfoAtCoordinate = jest.fn(() => {
      return Promise.resolve({
        features: [feat50, feat100],
      });
    });
    const layer = new GeltungsbereicheLayer({
      properties: { validPropertyName: 'valid_ga_hta' },
    });
    layer.map = new Map({ view: new View({ zoom: 15 }) });
    layer.mapboxLayer = {};
    const fi = await layer.getFeatureInfoAtCoordinate();
    expect(fi.features.length).toBe(2);
    expect(fi.features[0]).toBe(feat100);
    expect(fi.features[1]).toBe(feat50);
    MapboxStyleLayer.prototype.getFeatureInfoAtCoordinate.mockRestore();
  });

  test('should return only unique feature depending on the geltungsbereiche attribute (topic BETA)', async () => {
    const featA = new Feature({ geltungsbereiche: 'a' });
    const featA2 = new Feature({ geltungsbereiche: 'a' });
    const featB = new Feature({ geltungsbereiche: 'b' });
    MapboxStyleLayer.prototype.getFeatureInfoAtCoordinate = jest.fn(() => {
      return Promise.resolve({
        features: [featA, featB, featA2],
      });
    });
    const layer = new GeltungsbereicheLayer({
      properties: { validPropertyName: 'valid_ga_hta' },
    });
    layer.map = new Map({ view: new View({ zoom: 15 }) });
    layer.mapboxLayer = {};
    const fi = await layer.getFeatureInfoAtCoordinate();
    expect(fi.features.length).toBe(2);
    expect(fi.features[0]).toBe(featA);
    expect(fi.features[1]).toBe(featB);
    MapboxStyleLayer.prototype.getFeatureInfoAtCoordinate.mockRestore();
  });
});

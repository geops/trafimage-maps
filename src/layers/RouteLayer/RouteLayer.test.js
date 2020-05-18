import React from 'react';
import 'jest-canvas-mock';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'fetch-mock';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke, Circle, Fill, Icon } from 'ol/style';
import RouteLayer from './RouteLayer';
import { casa } from '../../config/topics';
import TrafimageMaps from '../../components/TrafimageMaps';
import finishFlag from '../../img/finish_flag.svg';

configure({ adapter: new Adapter() });

const routes = [
  {
    isClickable: true,
    isSelected: true,
    popupTitle: 'Route St. Gallen >> Zürich',
    popupContent: {
      Von: 'St. Gallen',
      Nach: 'Zürich HB',
    },
    sequences: [
      {
        uicFrom: 8503000,
        uicTo: 8506306,
        mot: 'rail',
      },
    ],
  },
];

const routeData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [1, 1],
          [10, 10],
        ],
      },
      properties: {
        lines: [],
        station_from: {
          id: '8506302',
          latitude: 9.3695504838,
          longitude: 47.4233618848,
          name: 'st gallen',
          platform: '',
        },
        station_to: {
          id: '8503000',
          latitude: 8.539596174,
          longitude: 47.3775484643,
          name: 'zuerich hauptbahnhof',
          platform: '',
        },
      },
    },
  ],
};

const feature = new Feature({
  geometry: new LineString([
    [50, 50],
    [50, 10],
  ]),
  mot: 'rail',
  route: {
    isClickable: true,
    popupContent: {
      Von: 'St. Gallen',
      Nach: 'Zürich HB',
    },
  },
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
  });

  test('should return the correct default style.', () => {
    const style = layer.defaultStyleFunction(feature);
    const olStyles = layer.getOlStylesFromObject(style, false, false, feature);

    expect(olStyles.base).toEqual(
      new Style({
        stroke: new Stroke({
          color: [235, 0, 0, 0.3],
          width: 6,
        }),
      }),
    );
  });

  test('should return the correct styles when selected.', async () => {
    layer.init(map);
    fetchMock.once(/routing/g, routeData);

    const [route] = await layer.loadRoutes(routes);
    const style = layer.routeStyle(route);

    expect(style[0].getZIndex()).toEqual(0.5);

    expect(style[1].getImage()).toEqual(
      new Circle({
        radius: 4,
        fill: new Fill({
          color: [255, 255, 255],
        }),
        stroke: new Stroke({
          color: [0, 0, 0],
          width: 1,
        }),
      }),
    );

    expect(style[3].getImage()).toEqual(
      new Icon({
        src: finishFlag,
        anchor: [4.5, 3.5],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        anchorOrigin: 'bottom-left',
        imgSize: [24, 24],
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

  test('should return a feature on loadRoute.', async () => {
    layer.init(map);
    fetchMock.once(/routing/g, routeData);

    const route = await layer.loadRoutes(routes);

    expect(route[0]).toBeInstanceOf(Feature);
  });

  test('shoud call onClick callbacks.', async () => {
    const coordinate = [50, 50];
    layer.init(map);
    jest.spyOn(map, 'getFeaturesAtPixel').mockReturnValue([feature]);
    jest.spyOn(map, 'forEachLayerAtPixel').mockReturnValue(layer.olLayer);

    expect(onClick).toHaveBeenCalledTimes(0);

    const evt = { type: 'singleclick', map, coordinate };
    await map.dispatchEvent(evt);

    expect(onClick).toHaveBeenCalledWith([feature], layer, coordinate);
  });

  test('shoud open a popup if popupContent is defined', async () => {
    jest.spyOn(Map.prototype, 'getFeaturesAtPixel').mockReturnValue([feature]);
    jest.spyOn(Map.prototype, 'hasFeatureAtPixel').mockReturnValue(true);

    const topicConf = [{ ...casa, layers: [layer] }];
    const component = mount(<TrafimageMaps topics={topicConf} apiKey="test" />);
    const compMap = component.find('Map').props().map;
    const spy = jest.spyOn(layer, 'getFeatureInfoAtCoordinate');
    const evt = { type: 'pointermove', map: compMap, coordinate: [50, 50] };
    await compMap.dispatchEvent(evt);
    await Promise.all(spy.mock.results.map((r) => r.value));
    component.update();

    expect(component.find('.wkp-casa-route-popup').text()).toBe(
      'Von: St. GallenNach: Zürich HB',
    );
  });
});

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
import finishFlag from '../../img/finish_flag.png';

configure({ adapter: new Adapter() });

const routes = [
  {
    isClickable: true,
    isSelected: true,
    popupTitle: 'Route St. Gallen >> Zürich',
    popupContent: ['Von: St. Gallen', 'Nach: Zürich HB'],
    sequences: [
      {
        uicFrom: 8503000,
        uicTo: 8507000,
        mot: 'rail',
      },
      {
        uicFrom: 8507000,
        uicTo: 8576579,
        mot: 'bus',
      },
    ],
  },
];

const routeDataRail = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [-1, 1],
      [10, -10],
    ],
  },
  properties: {
    lines: [],
    station_from: {
      id: '8503000',
      ident_source: 'sbb',
      latitude: 8.5373327691,
      longitude: 47.3785545925,
      name: 'Zürich HB',
      platform: '34',
    },
    station_to: {
      id: '8507000',
      ident_source: 'sbb',
      latitude: 7.4384644,
      longitude: 46.9493093,
      name: 'Bern',
      platform: '8',
    },
  },
};

const routeDataBus = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [-1, -1],
      [10, 10],
    ],
  },
  properties: {
    lines: [],
    station_from: {
      id: null,
      ident_source: null,
      latitude: 7.438445,
      longitude: 46.9489792,
      name: 'bern hauptbahnhof',
      platform: '',
    },
    station_to: {
      id: '8576579',
      ident_source: 'sbb',
      latitude: 7.6338961748,
      longitude: 46.7801596652,
      name: 'Steffisburg, Dorf',
      platform: '',
    },
  },
};

const feature = new Feature({
  geometry: new LineString([
    [10, 10],
    [1, 1],
  ]),
  mot: 'rail',
  route: {
    isClickable: true,
    popupContent: ['Von: St. Gallen', 'Nach: Zürich HB'],
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

const fetchRoutes = () => {
  /* Mock fetch for each sequence */
  fetchMock.once(/8503000/g, routeDataRail);
  fetchMock.once(/8576579/g, routeDataBus);
};

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
    fetchRoutes();

    const [rail, bus] = await layer.loadRoutes(routes);

    const styleRail = layer.routeStyle(rail);
    const styleBus = layer.routeStyle(bus);

    /* Circle markers should render at the first coordinate of the rail sequence and at the last coordinate
     * of the bus sequence. Bus sequence should return an additional style (flag icon) because it is the last sequence.
     */
    expect(styleRail).toHaveLength(2);
    expect(styleBus).toHaveLength(3);

    [styleRail, styleBus].forEach((styles) => {
      expect(styles[0].getZIndex()).toEqual(0.5);
      expect(styles[1].getImage()).toEqual(
        new Circle({
          radius: 3,
          fill: new Fill({
            color: [255, 255, 255],
          }),
          stroke: new Stroke({
            color: [0, 0, 0],
            width: 1,
          }),
        }),
      );
    });

    expect(styleBus[2].getImage()).toEqual(
      new Icon({
        src: finishFlag,
        anchor: [4.5, 3.5],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        anchorOrigin: 'bottom-left',
        imgSize: [24, 24],
        crossOrigin: 'anonymous',
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
    fetchRoutes();
    const route = await layer.loadRoutes(routes);

    expect(route[0]).toBeInstanceOf(Feature);
  });

  test('shoud call onClick callbacks and deselect on click.', async () => {
    const coordinate = [10, 10];
    fetchRoutes();
    layer.init(map);
    const features = await layer.loadRoutes(routes);
    jest.spyOn(map, 'getFeaturesAtPixel').mockReturnValue([features[0]]);
    jest.spyOn(map, 'forEachLayerAtPixel').mockReturnValue(layer.olLayer);

    expect(onClick).toHaveBeenCalledTimes(0);
    const evt = { type: 'singleclick', map, coordinate };
    await map.dispatchEvent(evt);
    expect(onClick).toHaveBeenCalledWith([features[0]], layer, coordinate);
    expect(layer.selectedRouteIds).toEqual([]);
  });

  test('shoud open a popup if popupContent is defined', async () => {
    jest.spyOn(Map.prototype, 'getFeaturesAtPixel').mockReturnValue([feature]);
    jest.spyOn(Map.prototype, 'hasFeatureAtPixel').mockReturnValue(true);

    const topicConf = [{ ...casa, layers: [layer] }];
    const component = mount(<TrafimageMaps topics={topicConf} apiKey="test" />);
    const compMapWrap = component.find('Map');
    const compMap = component.find('Map').props().map;
    const spy = jest.spyOn(layer, 'getFeatureInfoAtCoordinate');
    const spyPointerMove = jest.spyOn(compMapWrap.instance(), 'onPointerMove');
    const evt = { type: 'pointermove', map: compMap, coordinate: [50, 50] };
    await compMap.dispatchEvent(evt);
    await Promise.all(spy.mock.results.map((r) => r.value));
    await spyPointerMove;
    component.update();

    expect(component.find('.wkp-casa-route-popup').text()).toBe(
      'Von: St. GallenNach: Zürich HB',
    );
  });
});

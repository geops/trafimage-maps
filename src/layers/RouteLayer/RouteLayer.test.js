import fetchMock from 'fetch-mock';
import OLVectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke, Circle, Fill, Icon } from 'ol/style';
import RouteLayer from './RouteLayer';
import finishFlag from '../../img/finish_flag.png';

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
let mapElement;

const fetchRoutes = () => {
  /* Mock fetch for each sequence */
  fetchMock.once(/8503000/g, routeDataRail);
  fetchMock.once(/8576579/g, routeDataBus);
};

const fetchRoutesError = () => {
  /* Mock fetch for each sequence with HTTP errors */
  fetchMock.once(/8503000/g, 400);
  fetchMock.once(/8576579/g, 500);
};

describe('RouteLayer', () => {
  beforeEach(() => {
    mapElement = document.createElement('div');
    mapElement.style.width = '100px';
    mapElement.style.height = '100px';
    document.body.appendChild(mapElement);
    onClick = jest.fn();
    onMouseOver = jest.fn();
    layer = new RouteLayer({
      name: 'Layer',
      olLayer,
      onClick,
      onMouseOver,
    });
    map = new Map({
      target: mapElement,
      view: new View({ center: [0, 0], zoom: 1 }),
    });
  });

  afterEach(() => {
    fetchMock.reset();
    document.body.removeChild(mapElement);
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

  // This test failed because of the canvas mock but we don't know why.
  test('should return the correct styles when selected.', async () => {
    layer.attachToMap(map);
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
    layer.attachToMap(map);
    fetchRoutes();
    const route = await layer.loadRoutes(routes);

    expect(route[0]).toBeInstanceOf(Feature);
  });

  test('should skip failed API requests on loadRoute.', async () => {
    layer.attachToMap(map);
    fetchRoutesError();
    const route = await layer.loadRoutes(routes);

    expect(route).toEqual([]);
  });

  test('shoud call onClick callbacks and deselect on click.', async () => {
    const coordinate = [10, 10];
    fetchRoutes();
    layer.attachToMap(map);
    const features = await layer.loadRoutes(routes);
    jest.spyOn(map, 'getFeaturesAtPixel').mockReturnValue([features[0]]);

    expect(onClick).toHaveBeenCalledTimes(0);
    const evt = { type: 'singleclick', map, coordinate };
    await map.dispatchEvent(evt);
    expect(onClick.mock.calls[0][0]).toEqual([features[0]]);
    expect(onClick.mock.calls[0][1]).toBe(layer);
    expect(onClick.mock.calls[0][2]).toBe(coordinate);
    expect(layer.selectedRouteIds).toEqual([]);
  });
});

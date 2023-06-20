import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point, Polygon } from 'ol/geom';
import { Layer } from 'mobility-toolbox-js/ol';
import highlightPointStyle from '../../utils/highlightPointStyle';
import FeatureInformation from '.';

describe('FeatureInformation', () => {
  const mockStore = configureStore([thunk]);
  let storeUnMocked;
  let store;
  let layers = [];
  let fit;
  let cancelAnimations;
  const highlightLayer = new VectorLayer({
    source: new VectorSource({ features: [] }),
  });
  highlightLayer.setStyle(highlightPointStyle);

  beforeEach(() => {
    layers = [];
    fit = jest.fn();
    cancelAnimations = jest.fn();
    storeUnMocked = {
      map: { highlightLayer },
      app: {
        projection: { value: 'EPSG:3857' },
        map: {
          renderSync: () => {},
          getPixelFromCoordinate: jest.fn(() => [50, 50]),
          getSize: () => [100, 100],
          getView: () => ({
            cancelAnimations,
            fit,
            getZoom: () => {
              return 10;
            },
          }),
          getLayers: () => ({
            getArray: () => layers,
          }),
          addLayer: jest.fn((layer) => layers.push(layer)),
          removeLayer: jest.fn((layer) =>
            layers.splice(layers.indexOf(layer), 1),
          ),
        },
      },
    };
    store = mockStore(storeUnMocked);
  });
  afterEach(() => {
    fit.mockRestore();
    cancelAnimations.mockRestore();
  });

  test('adds/removes an highlightLayer on mount/unmount', () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [new Feature(new Point([2, 2]))],
        layer: l,
        coordinate: [2, 2],
      },
    ];
    const wraper = mount(
      <Provider store={store}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(store.getState().app.map.addLayer).toHaveBeenCalledTimes(1);
    const highlighLayer = store.getState().app.map.addLayer.mock.calls[0][0];
    wraper.unmount();
    expect(store.getState().app.map.removeLayer).toHaveBeenCalledWith(
      highlighLayer,
    );
    expect(highlighLayer.getStyle()).toBe(highlightPointStyle);
  });

  test('does not add twice the same layer', () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [new Feature(new Point([2, 2]))],
        layer: l,
        coordinate: [2, 2],
      },
    ];
    const wraper = mount(
      <Provider store={store}>
        <FeatureInformation featureInfo={fi} />
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(store.getState().app.map.addLayer).toHaveBeenCalledTimes(1);
    const highlighLayer = store.getState().app.map.addLayer.mock.calls[0][0];
    wraper.unmount();
    expect(store.getState().app.map.removeLayer).toHaveBeenCalledWith(
      highlighLayer,
    );
    expect(highlighLayer.getStyle()).toBe(highlightPointStyle);
  });

  test('adds an hihglight feature if the feature is not a point but mapbox displays an icon', () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [
          new Feature(
            new Polygon([
              [
                [2, 2],
                [3, 3],
                [4, 4],
              ],
            ]),
          ),
        ],
        layer: l,
        coordinate: [2.5, 2.5],
      },
    ];
    fi[0].features[0].set('mapboxFeature', {
      layer: { layout: { 'icon-image': 'foo' } },
    });
    const wrapper = mount(
      <Provider store={store}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(store.getState().app.map.addLayer).toHaveBeenCalledTimes(1);
    const highlighLayer = store.getState().app.map.addLayer.mock.calls[0][0];
    expect(highlighLayer.getSource().getFeatures().length).toBe(1);
    expect(
      highlighLayer.getSource().getFeatures()[0].getGeometry().getCoordinates(),
    ).toEqual([2.5, 2.5]);
    wrapper.unmount();
  });

  test("doesn't add an hihglight feature if the feature is not a point and not a mapbox feature", () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [
          new Feature(
            new Polygon([
              [
                [2, 2],
                [3, 3],
                [4, 4],
              ],
            ]),
          ),
        ],
        layer: l,
        coordinate: [2.5, 2.5],
      },
    ];
    const wrapper = mount(
      <Provider store={store}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(store.getState().app.map.addLayer).toHaveBeenCalledTimes(1);
    const highlighLayer = store.getState().app.map.addLayer.mock.calls[0][0];
    expect(highlighLayer.getSource().getFeatures().length).toBe(0);
    wrapper.unmount();
  });

  test('center the map on selected features if one of them is using an Overlay', () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        useOverlay: true,
        popupComponent: 'NetzkartePopup',
      },
    });
    const l2 = new Layer({
      key: 'bar',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [
          new Feature(
            new Polygon([
              [
                [0, 0],
                [1, 1],
                [2, 2],
              ],
            ]),
          ),
        ],
        layer: l,
        coordinate: [2.5, 2.5],
      },
      {
        features: [
          new Feature(
            new Polygon([
              [
                [2, 2],
                [3, 3],
                [4, 4],
              ],
            ]),
          ),
        ],
        layer: l2,
        coordinate: [2.5, 2.5],
      },
    ];
    storeUnMocked.app.screenWidth = 's';
    const wrapper = mount(
      <Provider store={mockStore(storeUnMocked)}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(cancelAnimations).toHaveBeenCalledTimes(1);
    expect(fit).toHaveBeenCalledTimes(1);
    expect(fit).toHaveBeenCalledWith([2.5, 2.5, 2.5, 2.5], {
      duration: 500,
      maxZoom: 10,
      padding: [0, 400, 0, 0],
    });
    wrapper.unmount();
  });

  test("center the map on selected feature if it's using an Overlay (mobile)", () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        useOverlay: true,
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [
          new Feature(
            new Polygon([
              [
                [0, 0],
                [1, 1],
                [2, 2],
              ],
            ]),
          ),
        ],
        layer: l,
        coordinate: [2.5, 2.5],
      },
    ];
    storeUnMocked.app.screenWidth = 'xs';
    const wrapper = mount(
      <Provider store={mockStore(storeUnMocked)}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(cancelAnimations).toHaveBeenCalledTimes(1);
    expect(fit).toHaveBeenCalledTimes(1);
    expect(fit).toHaveBeenCalledWith([2.5, 2.5, 2.5, 2.5], {
      duration: 500,
      maxZoom: 10,
      padding: [0, 0, 250, 0],
    });
    wrapper.unmount();
  });

  test("doesn't center the map on selected feature if it's not using an Overlay'", () => {
    const l = new Layer({
      key: 'foo',
      properties: {
        useOverlay: true,
        popupComponent: 'NetzkartePopup',
      },
    });
    const l2 = new Layer({
      key: 'bar',
      properties: {
        popupComponent: 'NetzkartePopup',
      },
    });
    const fi = [
      {
        features: [
          new Feature(
            new Polygon([
              [
                [0, 0],
                [1, 1],
                [2, 2],
              ],
            ]),
          ),
        ],
        layer: l2,
        coordinate: [2.5, 2.5],
      },
      {
        features: [
          new Feature(
            new Polygon([
              [
                [2, 2],
                [3, 3],
                [4, 4],
              ],
            ]),
          ),
        ],
        layer: l,
        coordinate: [2.5, 2.5],
      },
    ];
    const wrapper = mount(
      <Provider store={store}>
        <FeatureInformation featureInfo={fi} />
      </Provider>,
    );
    expect(cancelAnimations).toHaveBeenCalledTimes(0);
    expect(fit).toHaveBeenCalledTimes(0);
    wrapper.unmount();
  });

  describe('should match snapshot.', () => {
    test("using the layers's popupComponent", () => {
      const l = new Layer({
        key: 'foo',
        properties: {
          popupComponent: 'NetzkartePopup',
        },
      });
      const fi = [
        {
          features: [new Feature(new Point([2, 2]))],
          layer: l,
          coordinate: [2, 2],
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation featureInfo={fi} />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test("using the info's popupComponent", () => {
      const l = new Layer({
        key: 'foo',
      });
      const fi = [
        {
          features: [new Feature(new Point([2, 2]))],
          layer: l,
          coordinate: [2, 2],
          popupComponent: 'NetzkartePopup',
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation featureInfo={fi} />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should display multiple features with pagination', () => {
      const l = new Layer({
        key: 'foo',
      });
      const fi = [
        {
          features: [
            new Feature(new Point([2, 2])),
            new Feature(new Point([1, 1])),
          ],
          layer: l,
          coordinate: [2, 2],
          popupComponent: 'NetzkartePopup',
        },
        {
          features: [
            new Feature(new Point([2, 2])),
            new Feature(new Point([1, 1])),
          ],
          layer: l,
          coordinate: [2, 2],
          popupComponent: 'NetzkartePopup',
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation featureInfo={fi} />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('should not display header', () => {
      const l = new Layer({
        key: 'foo',
      });
      const fi = [
        {
          features: [new Feature(new Point([2, 2]))],
          layer: l,
          coordinate: [2, 2],
          popupComponent: 'KilometragePopup',
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation featureInfo={fi} />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

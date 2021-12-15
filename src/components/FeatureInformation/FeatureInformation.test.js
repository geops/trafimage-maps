import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Layer } from 'mobility-toolbox-js/ol';
import highlightPointStyle from '../../utils/highlightPointStyle';
import FeatureInformation from '.';

describe('FeatureInformaion', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let layers = [];

  beforeEach(() => {
    layers = [];
    store = mockStore({
      map: {},
      app: {
        projection: { value: 'EPSG:3857' },
        map: {
          getLayers: () => ({
            getArray: () => layers,
          }),
          addLayer: jest.fn((layer) => layers.push(layer)),
          removeLayer: jest.fn((layer) =>
            layers.splice(layers.indexOf(layer), 1),
          ),
        },
      },
    });
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
          popupComponent: 'NetzkartePopup',
        },
        {
          features: [
            new Feature(new Point([2, 2])),
            new Feature(new Point([1, 1])),
          ],
          layer: l,
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

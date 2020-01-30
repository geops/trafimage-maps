import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Map, View, Feature } from 'ol';
import { Point } from 'ol/geom';
import { get } from 'ol/proj';
import Layer from 'react-spatial/layers/Layer';

import FeatureInformation from '.';

describe('FeatureInformaion', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let map;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: { projection: { value: 'EPSG:3857' } },
      oidc: { user: {} },
    });
    map = new Map({ view: new View({}) });
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
          features: [new Feature(new Point([0, 0]))],
          layer: l,
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation clickedFeatureInfo={fi} />
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
          features: [new Feature(new Point([0, 0]))],
          layer: l,
          popupComponent: 'NetzkartePopup',
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation clickedFeatureInfo={fi} />
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
            new Feature(new Point([0, 0])),
            new Feature(new Point([1, 1])),
          ],
          layer: l,
          popupComponent: 'NetzkartePopup',
        },
        {
          features: [
            new Feature(new Point([0, 0])),
            new Feature(new Point([1, 1])),
          ],
          layer: l,
          popupComponent: 'NetzkartePopup',
        },
      ];

      const component = renderer.create(
        <Provider store={store}>
          <FeatureInformation clickedFeatureInfo={fi} />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

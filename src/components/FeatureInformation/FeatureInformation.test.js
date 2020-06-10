import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Layer from 'react-spatial/layers/Layer';

import FeatureInformation from '.';

describe('FeatureInformaion', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: { projection: { value: 'EPSG:3857' } },
      oidc: { user: {} },
    });
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

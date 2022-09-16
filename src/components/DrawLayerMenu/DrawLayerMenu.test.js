import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Layer';
import LayerService from '../../utils/LayerService';
import DrawLayerMenu from './DrawLayerMenu';

describe('DrawLayerMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;
  const drawLayer = new Layer({
    olLayer: new OLLayer({}),
  });

  describe('should match snapshot.', () => {
    test('should return null', () => {
      const layerService = new LayerService([]);
      store = mockStore({
        map: {
          drawLayer,
        },
        app: { layerService },
      });
      const component = renderer.create(
        <Provider store={store}>
          <DrawLayerMenu />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('using the layerService property', () => {
      const layerService = new LayerService([]);
      store = mockStore({
        map: {
          drawLayer,
        },
        app: {
          drawIds: { admin_id: 'foo' },
          layerService,
        },
      });
      const component = renderer.create(
        <Provider store={store}>
          <DrawLayerMenu />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  test('display only draw layer', () => {
    const layerService = new LayerService([
      new Layer({ olLayer: new OLLayer({}) }),
      store.getState().map.drawLayer,
    ]);
    store = mockStore({
      map: {
        drawLayer,
      },
      app: {
        drawIds: { admin_id: 'foo' },
        layerService,
      },
    });
    const wrapper = mount(
      <Provider store={store}>
        <DrawLayerMenu />
      </Provider>,
    );
    expect(layerService.layers.length).toBe(2);
    expect(wrapper.find('.rs-layer-tree-item').length).toBe(1);
  });
});

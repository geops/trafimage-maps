import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import LayerService from 'react-spatial/LayerService';
import { mount } from 'enzyme';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Layer';
import DrawLayerMenu from './DrawLayerMenu';

describe('DrawLayerMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: {
        drawLayer: new Layer({
          olLayer: new OLLayer({}),
        }),
      },
      app: {},
    });
  });

  describe('should match snapshot.', () => {
    test('using the layerService property', () => {
      const layerService = new LayerService([]);
      const component = renderer.create(
        <Provider store={store}>
          <DrawLayerMenu layerService={layerService} />
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
    const wrapper = mount(
      <Provider store={store}>
        <DrawLayerMenu layerService={layerService} />
      </Provider>,
    );
    expect(layerService.layers.length).toBe(2);
    expect(wrapper.find('.rs-layer-tree-item').length).toBe(1);
  });
});

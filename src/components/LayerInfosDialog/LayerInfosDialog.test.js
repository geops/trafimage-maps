import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Layer } from 'mobility-toolbox-js/ol';
import { mount } from 'enzyme';
import OLLayer from 'ol/layer/Vector';
import LayerInfosDialog from '.';

describe('LayerInfosDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let layer;

  beforeEach(() => {
    layer = new Layer({
      name: 'test',
      olLayer: new OLLayer(),
      properties: {
        description: 'description<br/>break',
      },
    });
    store = mockStore({
      app: {
        language: 'de',
        t: (t) => t,
      },
    });
  });

  test('should match snapshot when Layer is null', () => {
    const component = mount(
      <Provider store={store}>
        <LayerInfosDialog />
      </Provider>,
    );
    expect(component.html()).toMatchSnapshot();
  });

  test('should match snapshot when Layer is defined', () => {
    const component = mount(
      <Provider store={store}>
        <LayerInfosDialog selectedForInfos={layer} />
      </Provider>,
    );
    expect(component.html()).toMatchSnapshot();
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, screen } from '@testing-library/react';
import OLMap from 'ol/Map';
import { Layer } from 'mobility-toolbox-js/ol';
import GeltungsbereicheTopicMenu from './GeltungsbereicheTopicMenu';

describe('GeltungsbereicheTopicMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;
  const baseLayer = new Layer({
    name: 'base',
    visible: true,
    properties: { isBaseLayer: true },
  });
  const layer1 = new Layer({ name: 'foo', visible: false });
  const layer2 = new Layer({ name: 'bar', visible: true });

  test('should display the menu and select the good value', () => {
    store = mockStore({
      map: { layers: [baseLayer, layer1, layer2] },
      app: { map: new OLMap({}), menuOpen: false },
    });

    const { container } = render(
      <Provider store={store}>
        <GeltungsbereicheTopicMenu />
      </Provider>,
    );

    expect(container.querySelectorAll('.wkp-menu-item').length).toBe(1);
    expect(container.querySelectorAll('.wkp-gb-topic-menu').length).toBe(1);
    expect(screen.getByText('bar')).toBeInTheDocument();
  });
});

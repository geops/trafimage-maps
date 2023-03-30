import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';
import OLMap from 'ol/Map';
import IpvMenu from './IpvMenu';
import { ipvIframe } from '../../config/topics';
import ipvLayers from '../../config/ch.sbb.ipv';
import { IPV_KEY } from '../../utils/constants';

describe('IpvMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    ipvLayers.find((layer) => layer.get('isBaseLayer')).url =
      'https://foo-maps.io';
    store = mockStore({
      map: { layers: ipvLayers },
      app: {
        map: new OLMap({}),
        activeTopic: ipvIframe,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test('should render two checked switches for two visible layers and deactivate on click', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <IpvMenu />
      </Provider>,
    );

    expect(getByTestId('ipv-layerswitcher')).toBeTruthy();
    const nightLayer = ipvLayers.find(
      (layer) => layer.key === `${IPV_KEY}.night`,
    );
    const dayLayer = ipvLayers.find((layer) => layer.key === `${IPV_KEY}.day`);
    [nightLayer, dayLayer].forEach((layer) => {
      expect(layer.visible).toBe(true);
      expect(
        getByTestId(`ipv-layerswitcher-${layer.key}`).classList.contains(
          'Mui-checked',
        ),
      );
    });
    const nightSwitch = getByTestId(`ipv-layerswitcher-${nightLayer.key}`);
    fireEvent.click(nightSwitch);
    expect(nightSwitch.classList.contains('Mui-checked')).toBe(false);
  });

  test('should not hide menu on mobile', () => {
    store = mockStore({
      map: { layers: ipvLayers },
      app: {
        map: new OLMap({}),
        activeTopic: ipvIframe,
        featureInfo: [],
        displayMenu: true,
        screenWidth: 'xs',
      },
    });
    render(
      <Provider store={store}>
        <IpvMenu />
      </Provider>,
    );
    expect(store.getActions()[0]).toEqual({
      type: 'SET_DISPLAY_MENU',
      data: false,
    });
  });
});

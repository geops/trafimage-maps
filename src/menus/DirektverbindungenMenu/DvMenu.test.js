import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';
import OLMap from 'ol/Map';
import DvMenu from './DvMenu';
import { direktverbindungenIframe } from '../../config/topics';
import dvLayers from '../../config/ch.sbb.direktverbindungen';
import { DV_KEY } from '../../utils/constants';

describe('DvMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    dvLayers.find((layer) => layer.get('isBaseLayer')).url =
      'https://foo-maps.io';
    store = mockStore({
      map: { layers: dvLayers },
      app: {
        map: new OLMap({}),
        activeTopic: direktverbindungenIframe,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test('should render two checked switches for two visible layers and deactivate on click', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DvMenu />
      </Provider>,
    );

    expect(getByTestId('dv-layerswitcher')).toBeTruthy();
    const nightLayer = dvLayers.find(
      (layer) => layer.key === `${DV_KEY}.night`,
    );
    const dayLayer = dvLayers.find((layer) => layer.key === `${DV_KEY}.day`);
    [nightLayer, dayLayer].forEach((layer) => {
      expect(layer.visible).toBe(true);
      expect(
        getByTestId(`dv-layerswitcher-${layer.key}`).classList.contains(
          'Mui-checked',
        ),
      );
    });
    const nightSwitch = getByTestId(`dv-layerswitcher-${nightLayer.key}`);
    fireEvent.click(nightSwitch);
    expect(nightSwitch.classList.contains('Mui-checked')).toBe(false);
  });

  test('should not hide menu on mobile', () => {
    store = mockStore({
      map: { layers: dvLayers },
      app: {
        map: new OLMap({}),
        activeTopic: direktverbindungenIframe,
        featureInfo: [],
        displayMenu: true,
        screenWidth: 'xs',
      },
    });
    render(
      <Provider store={store}>
        <DvMenu />
      </Provider>,
    );
    expect(store.getActions()[0]).toEqual({
      type: 'SET_DISPLAY_MENU',
      data: false,
    });
  });
});

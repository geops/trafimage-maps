import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import OLMap from 'ol/Map';
import ipvLayers from '../index';
import { ipvIframe } from '../../topics';
import IpvListButton from './IpvListButton';

describe('IpvListButton', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
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

  test('should match snapshot and be disabled on load.', () => {
    const { container, getByTestId } = render(
      <Provider store={store}>
        <IpvListButton />
      </Provider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
    expect(getByTestId('ipv-list-button')).toBeDisabled();
  });
});

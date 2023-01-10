import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, within, fireEvent } from '@testing-library/react';
import OLMap from 'ol/Map';
import StsMenu from './StsMenu';
import { sts } from '../../config/topics';
import stsLayers from '../../config/ch.sbb.sts';

describe('GeltungsbereicheTopicMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: { layers: stsLayers },
      app: {
        map: new OLMap({}),
        activeTopic: sts,
        featureInfo: [],
        displayMenu: true,
      },
    });
  });

  test('should render the menu opener and sts validity layerswitcher on load', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <StsMenu />
      </Provider>,
    );

    const opener = getByTestId('sts-menu-opener');
    expect(opener).toBeTruthy();
    const { getByText } = within(opener);
    expect(getByText('Validity of Swiss Travel Pass')).toBeInTheDocument();
    expect(getByTestId('sts-validity-layerswitcher')).toBeTruthy();
  });

  test('should switch to Direktverbindungen when switching in the menu', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <StsMenu />
      </Provider>,
    );

    const opener = getByTestId('sts-menu-opener');
    expect(opener).toBeTruthy();
    const menuPopover = getByTestId('sts-menu-popover');
    expect(menuPopover.getAttribute('aria-hidden')).toEqual('true');
    fireEvent.click(opener);
    expect(menuPopover.getAttribute('aria-hidden')).toEqual(null);
    fireEvent.click(getByTestId('sts-menu-dv'));
    expect(menuPopover.getAttribute('aria-hidden')).toEqual('true');
    const { getByText } = within(opener);
    expect(getByText('Direct trains to Switzerland')).toBeInTheDocument();
  });
});

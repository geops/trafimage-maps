import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import OLMap from 'ol/Map';
import { render } from '@testing-library/react';
import DrawMenu from './DrawMenu';

describe('DrawMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;
  test.only('should use MenuItem and display Draw', () => {
    const info = {
      key: 'foo',
      elements: {
        drawMenu: true,
      },
    };
    store = mockStore({
      map: {},
      app: { activeTopic: info, map: new OLMap(), menuOpen: true },
    });
    const { container } = render(
      <Provider store={store}>
        <DrawMenu />
      </Provider>,
    );

    expect(container.querySelectorAll('.wkp-menu-item').length).toBe(1);
    expect(
      container.querySelectorAll('.wkp-menu-item-header-title')[0].textContent,
    ).toBe('Zeichnen auf der Karte');
    expect(container.querySelectorAll('button').length).toBe(3);
  });
});

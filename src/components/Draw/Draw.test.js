import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from '@material-ui/core';
import { render, fireEvent } from '@testing-library/react';
import { MatomoProvider } from '@datapunt/matomo-tracker-react';
import theme from '../../themes/default';

import Draw from '.';

describe('Draw', () => {
  const mockStore = configureStore([thunk]);
  let store;

  test('should render only one disabled button', () => {
    store = mockStore({
      map: {},
      app: { drawIds: {} },
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Draw />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.querySelectorAll('button[disabled]').length).toBe(1);
    expect(container.querySelectorAll('button:not([disabled])').length).toBe(2);
    expect(
      container.querySelectorAll('div[role=button]:not(.Mui-disabled)').length,
    ).toBe(1);
  });

  test('should render three disabled buttons', () => {
    store = mockStore({
      map: {},
      app: {},
    });
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Draw />
        </Provider>
      </ThemeProvider>,
    );
    expect(container.querySelectorAll('button:not([disabled])').length).toBe(1);
    expect(container.querySelectorAll('button[disabled]').length).toBe(2);
    expect(
      container.querySelectorAll('div.Mui-disabled[role=button]').length,
    ).toBe(1);
  });

  test('should send track event on draw add button', () => {
    window.open = jest.fn();
    store = mockStore({
      map: {},
      app: { activeTopic: { key: 'foo' } },
    });
    const matomo = {
      pushInstruction: jest.fn(),
      trackPageView: jest.fn(),
      trackEvent: jest.fn(),
    };
    const { container } = render(
      <MatomoProvider value={matomo}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Draw />
          </Provider>
        </ThemeProvider>
      </MatomoProvider>,
    );
    fireEvent.click(container.querySelector('button:not([disabled])'));
    expect(matomo.trackEvent).toBeCalledWith({
      action: 'clickNewDraw',
      category: 'foo',
    });
    expect(window.open).toBeCalledWith(
      'undefined?parent=http%3A%2F%2Flocalhost%2F',
      '_self',
    );
    window.open.mockRestore();
  });
});

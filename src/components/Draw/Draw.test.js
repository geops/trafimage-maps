import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
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
    expect(container.querySelectorAll('button:not([disabled])').length).toBe(3);
    expect(container.querySelectorAll('button[disabled]').length).toBe(1);
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
    expect(container.querySelectorAll('button[disabled]').length).toBe(3);
  });
});

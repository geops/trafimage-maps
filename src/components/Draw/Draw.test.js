import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { ThemeProvider } from '@material-ui/core';
import { shallow } from 'enzyme';
import theme from '../../themes/default';

import Draw from '.';

describe('Draw', () => {
  const mockStore = configureStore([thunk]);
  let store;

  test('should render only one enabled link', () => {
    store = mockStore({
      map: {},
      app: { drawIds: {} },
    });
    const wrapper = shallow(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Draw />
        </Provider>
      </ThemeProvider>,
    );
    expect(wrapper.find('div').length).toBe(0);
  });
});

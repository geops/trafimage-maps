import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { ThemeProvider, IconButton } from '@material-ui/core';
import { mount } from 'enzyme';
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
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Draw />
        </Provider>
      </ThemeProvider>,
    );
    expect(wrapper.find(IconButton).length).toBe(4);
    expect(wrapper.find('button[disabled=false]').length).toBe(3);
    expect(wrapper.find('button[disabled=true]').length).toBe(1);
  });

  test('should render three disabled buttons', () => {
    store = mockStore({
      map: {},
      app: {},
    });
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Draw />
        </Provider>
      </ThemeProvider>,
    );
    expect(wrapper.find(IconButton).length).toBe(4);
    expect(wrapper.find('button[disabled=false]').length).toBe(1);
    expect(wrapper.find('button[disabled=true]').length).toBe(3);
  });
});

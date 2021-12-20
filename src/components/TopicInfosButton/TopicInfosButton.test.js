import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import TopicInfosButton from '.';

describe('TopicInfosButton', () => {
  const mockStore = configureStore([thunk]);
  let store;

  test('renders active state', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { activeTopic: info, selectedForInfos: {} },
    });
    const wrapper = mount(
      <Provider store={store}>
        <TopicInfosButton topic={info} />
      </Provider>,
    );
    expect(wrapper.find('button').prop('className')).toBe(
      'MuiButtonBase-root MuiIconButton-root wkp-info-bt wkp-active',
    );
  });

  test('renders selected and active state', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { activeTopic: info, selectedForInfos: info },
    });
    const wrapper = mount(
      <Provider store={store}>
        <TopicInfosButton topic={info} />
      </Provider>,
    );
    expect(wrapper.find('button').prop('className')).toBe(
      'MuiButtonBase-root MuiIconButton-root wkp-info-bt wkp-active wkp-selected',
    );
  });
});

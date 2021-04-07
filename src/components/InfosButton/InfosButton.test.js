import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import InfosButton from '.';

describe('InfosButton', () => {
  const mockStore = configureStore([thunk]);
  let store;

  test('renders not selected info button  ', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { selectedForInfos: {} },
    });
    const wrapper = mount(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(wrapper.find('Button').prop('className')).toBe('wkp-info-bt');
  });

  test('renders selected info button ', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { selectedForInfos: info },
    });
    const wrapper = mount(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    wrapper.update();
    expect(wrapper.find('Button').prop('className')).toBe(
      'wkp-info-bt wkp-selected',
    );
  });

  test('select on click ', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { selectedForInfos: {} },
    });
    const wrapper = mount(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(wrapper.find('Button').prop('className')).toBe('wkp-info-bt');
    wrapper.find('Button').simulate('click');
    expect(store.getActions()[0]).toEqual({
      data: { key: 'foo' },
      type: 'SET_SELECTED_FOR_INFOS',
    });
  });

  test('deselect on click', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { selectedForInfos: info },
    });
    const wrapper = mount(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(wrapper.find('Button').prop('className')).toBe(
      'wkp-info-bt wkp-selected',
    );
    wrapper.find('Button').simulate('click');
    expect(store.getActions()[0]).toEqual({
      data: null,
      type: 'SET_SELECTED_FOR_INFOS',
    });
  });
});

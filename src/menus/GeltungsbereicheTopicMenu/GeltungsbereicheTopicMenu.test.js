import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import OLMap from 'ol/Map';
import GeltungsbereicheTopicMenu from './GeltungsbereicheTopicMenu';
import Draw from '../../components/Draw';

describe('GeltungsbereicheTopicMenu', () => {
  const mockStore = configureStore([thunk]);
  let store;
  test('should use MenuItem and display Draw', () => {
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
    const wrapper = mount(
      <Provider store={store}>
        <GeltungsbereicheTopicMenu />
      </Provider>,
    );

    expect(wrapper.find('.wkp-menu-item').length).toBe(1);
    expect(wrapper.find('.wkp-menu-item-header-title').childAt(0).text()).toBe(
      'Zeichnen auf der Karte',
    );
    expect(wrapper.find(Draw).length).toBe(1);
  });
});

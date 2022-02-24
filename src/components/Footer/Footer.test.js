import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Map from 'ol/Map';
import Footer from '.';

const dfltStore = {
  map: {},
  app: {
    map: new Map({}),
    projection: {
      label: 'WGS 84',
      value: 'EPSG:4326',
      format: (c) => c,
    },
  },
};
describe('Footer', () => {
  test('renders default elements', () => {
    const store = global.mockStore({ ...dfltStore });
    const wrapper = mount(
      <Provider store={store}>
        <Footer />
      </Provider>,
    );
    expect(wrapper.find('ScaleLine').length).toBe(1);
    expect(wrapper.find('Memo(ProjectionSelect)').length).toBe(1);
    expect(wrapper.find('MousePosition').length).toBe(1);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('button').length).toBe(3);
  });

  test('renders cookies settings link if consentGiven is true', () => {
    const store = global.mockStore({
      ...dfltStore,
      app: {
        ...dfltStore.app,
        consentGiven: true,
      },
    });
    const wrapper = mount(
      <Provider store={store}>
        <Footer />
      </Provider>,
    );
    expect(wrapper.find('ScaleLine').length).toBe(1);
    expect(wrapper.find('Memo(ProjectionSelect)').length).toBe(1);
    expect(wrapper.find('MousePosition').length).toBe(1);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('button').length).toBe(4);
  });
});

import React from 'react';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import DrawEditLinkInput from '.';

describe('DrawEditLinkInput', () => {
  const mockStore = configureStore([thunk]);
  let store;

  describe('should match snapshot.', () => {
    test('return null if no admin_id value', () => {
      store = mockStore({
        map: {},
        app: {
          drawIds: {},
        },
      });
      const component = renderer.create(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  test('fetches shorten url and displays result in an input', async () => {
    store = mockStore({
      map: {},
      app: {
        mapsetUrl: 'http://mapsetbar.ch',
        shortenerUrl: 'http://shortenfoo.ch',
        drawIds: { admin_id: 'foo' },
      },
    });
    let wrapper;
    await act(async () => {
      fetchMock.once(
        'http://shortenfoo.ch?url=http://mapsetbar.ch?parent=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo',
        { url: 'http://shortqux.ch/qur' },
      );
      wrapper = mount(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
    });
    wrapper.update();
    expect(wrapper.find('input').props().value).toBe('http://shortqux.ch/qur');
    fetchMock.restore();
  });

  test('fails to fetch the shorten url and displays the url unshortened in an input', async () => {
    store = mockStore({
      map: {},
      app: {
        mapsetUrl: 'http://mapsetbar.ch',
        shortenerUrl: 'http://shortenfoo.ch',
        drawIds: { admin_id: 'foo' },
      },
    });
    let wrapper;
    await act(async () => {
      fetchMock.once(
        'http://shortenfoo.ch?url=http://mapsetbar.ch?parent=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo',
        { error: 'Bad parameter' },
      );
      wrapper = mount(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
    });
    wrapper.update();
    expect(wrapper.find('input').props().value).toBe(
      'http://mapsetbar.ch?parent=http%3A%2F%2Flocalhost%2F%3Fdraw.id%3Dfoo',
    );
    fetchMock.restore();
  });
});

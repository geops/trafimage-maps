import React from 'react';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import DrawEditLinkInput from '.';

describe('DrawEditLinkInput', () => {
  const mockStore = configureStore([thunk]);
  let store;

  describe('should match snapshot.', () => {
    test('return null if no admin_id value', () => {
      store = mockStore({
        map: {},
        app: {},
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

  test('display input text with the draw edit link', async () => {
    store = mockStore({
      map: {},
      app: {
        drawEditLink: 'http://foo.ch',
      },
    });
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
    });
    wrapper.update();
    expect(wrapper.find('input').props().value).toBe('http://foo.ch');
  });
});

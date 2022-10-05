import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import Login from '.';

describe('Login', () => {
  describe('matches snapshot', () => {
    test('displaying default text', () => {
      const store = global.mockStore({
        app: { appBaseUrl: 'http://foo.de' },
      });
      const component = renderer.create(
        <Provider store={store}>
          <Login />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('displaying user name', () => {
      const store = global.mockStore({
        app: { permissionInfos: { user: 'bar' }, appBaseUrl: 'http://foo.de' },
      });
      const component = renderer.create(
        <Provider store={store}>
          <Login />
        </Provider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

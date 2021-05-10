import 'jest-canvas-mock';
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import ExportMenu from '.';

configure({ adapter: new Adapter() });

describe('ExportMenu', () => {
  const mockStore = configureStore([thunk]);

  test('should match snapshot when not logged in.', () => {
    const store = mockStore({
      app: {
        menuOpen: true,
        map: new Map({ view: new View({}) }),
        permissionInfos: null,
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <ExportMenu />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should match snapshot when logged in.', () => {
    const store = mockStore({
      app: {
        menuOpen: true,
        map: new Map({ view: new View({}) }),
        permissionInfos: {
          user: {},
        },
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <ExportMenu />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import 'jest-canvas-mock';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Map, View } from 'ol';
import ExportDialog from '.';

configure({ adapter: new Adapter() });

describe('ExportDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let map;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: {},
      oidc: { user: {} },
    });
    map = new Map({ view: new View({}) });
  });

  test('should match snapshot.', () => {
    const component = renderer.create(
      <Provider store={store}>
        <ExportDialog map={map} name="foo" />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

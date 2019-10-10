import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import Share from '.';

configure({ adapter: new Adapter() });

describe('Share', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      app: {
        map: new Map({ view: new View({}) }),
      },
    });
  });

  test('should match snapshot.', () => {
    const component = renderer.create(
      <Provider store={store}>
        <Share />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

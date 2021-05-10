import 'jest-canvas-mock';
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import Share from '.';

configure({ adapter: new Adapter() });

describe('Share', () => {
  const mockStore = configureStore([thunk]);

  test('should match snapshot.', () => {
    const store = mockStore({
      app: {
        map: new Map({ view: new View({}) }),
        activeTopic: {
          key: 'test',
        },
        language: 'de',
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <Share appBaseUrl="https://maps.trafimage.ch" />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

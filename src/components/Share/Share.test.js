import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import Share from '.';

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
        appBaseUrl: 'https://maps.trafimage.ch',
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <Share />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

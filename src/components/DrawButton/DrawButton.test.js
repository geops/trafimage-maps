import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import DrawButton from '.';

describe('DrawButton', () => {
  test('should match snapshot appending an encoded string to mapsetUrl.', () => {
    const mockStore = configureStore([thunk]);
    const store = mockStore({
      map: {},
      app: { mapsetUrl: 'foo.mapset.ch' },
    });

    const component = renderer.create(
      <Provider store={store}>
        <DrawButton />
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

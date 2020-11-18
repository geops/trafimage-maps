import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import DrawPermalinkButton from '.';

describe('DrawPermalinkButton', () => {
  const mockStore = configureStore([thunk]);
  let store;
  test('should match snapshot.', () => {
    store = mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = renderer.create(
      <Provider store={store}>
        <DrawPermalinkButton>
          <div />
        </DrawPermalinkButton>
      </Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

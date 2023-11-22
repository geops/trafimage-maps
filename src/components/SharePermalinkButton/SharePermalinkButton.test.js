import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import SharePermalinkButton from '.';

describe('SharePermalinkButton', () => {
  const mockStore = configureStore([thunk]);
  let store;
  test('should match snapshot.', () => {
    store = mockStore({
      map: {},
      app: { drawIds: {} },
    });

    const component = render(
      <Provider store={store}>
        <SharePermalinkButton />
      </Provider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});

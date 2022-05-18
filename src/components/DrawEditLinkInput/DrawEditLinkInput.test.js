import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
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
      const { container } = render(
        <Provider store={store}>
          <DrawEditLinkInput />
        </Provider>,
      );
      expect(container.innerHTML).toBe('');
    });
  });

  test('display input text with the draw edit link', async () => {
    store = mockStore({
      map: {},
      app: {
        drawEditLink: 'http://foo.ch',
      },
    });
    const { container } = render(
      <Provider store={store}>
        <DrawEditLinkInput />
      </Provider>,
    );
    await waitFor(() => container.querySelector('input').value);
    expect(container.querySelector('input').value).toBe('http://foo.ch');
  });
});

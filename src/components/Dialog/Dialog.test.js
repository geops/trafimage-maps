import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Map, View } from 'ol';
import { render } from '@testing-library/react';
import Dialog from './Dialog';

describe('Dialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let map;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: {},
    });
    map = new Map({ view: new View({}) });
  });

  test('should match snapshot.', () => {
    const component = render(
      <Provider store={store}>
        <Dialog map={map} name="foo" />
      </Provider>,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  // TODO: test focus document.activeElement on popup close
});

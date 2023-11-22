import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Vector';
import { render } from '@testing-library/react';
import DrawRemoveDialog from '.';

describe('DrawRemoveDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      app: {
        dialogPosition: {
          top: 0,
          left: 0,
        },
      },
      map: {
        drawlayer: new Layer({
          name: 'test',
          olLayer: new OLLayer(),
          properties: {
            description: 'description<br/>break',
          },
        }),
      },
    });
  });

  test('should match snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <DrawRemoveDialog />
      </Provider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test('remove permalink on click on remove button', () => {
    const { container } = render(
      <Provider store={store}>
        <DrawRemoveDialog />
      </Provider>,
    );
    expect(container.querySelector('input').value).toBe('');
  });
});

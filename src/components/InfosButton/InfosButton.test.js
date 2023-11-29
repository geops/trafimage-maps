/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import InfosButton from '.';
import getStore from '../../model/store';
import { setSelectedForInfos } from '../../model/app/actions';

describe('InfosButton', () => {
  const mockStore = configureStore([thunk]);
  let store;

  test('renders not selected info button  ', () => {
    const info = { key: 'foo' };
    store = getStore();
    const { container } = render(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(container.querySelector('button').className).toMatch('wkp-info-bt');
    expect(container.querySelector('button').className).not.toMatch(
      'wkp-selected',
    );
  });

  test('renders selected info button ', () => {
    const info = { key: 'foo' };
    store = mockStore({
      map: {},
      app: { selectedForInfos: info },
    });
    const { container } = render(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(container.querySelector('button').className).toMatch(
      'wkp-info-bt wkp-selected',
    );
  });

  test('select on click ', async () => {
    const user = userEvent.setup();
    const info = { key: 'foo' };
    store = getStore();
    const { container } = render(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(container.querySelector('button').className).toMatch('wkp-info-bt');
    expect(container.querySelector('button').className).not.toMatch(
      'wkp-selected',
    );

    // You can also call this method directly on userEvent,
    // but using the methods from `.setup()` is recommended.
    await user.click(container.querySelector('button'));
    await waitFor(() =>
      expect(container.querySelector('button').className).toMatch(
        'wkp-info-bt wkp-selected',
      ),
    );
  });

  test('deselect on click', async () => {
    const user = userEvent.setup();
    const info = { key: 'foo' };
    store = getStore();
    store.dispatch(setSelectedForInfos(info));
    const { container } = render(
      <Provider store={store}>
        <InfosButton selectedInfo={info} />
      </Provider>,
    );
    expect(container.querySelector('button').className).toMatch(
      'wkp-info-bt wkp-selected',
    );
    await user.click(container.querySelector('button'));
    expect(container.querySelector('button').className).toMatch('wkp-info-bt');

    expect(container.querySelector('button').className).not.toMatch(
      'wkp-selected',
    );
  });
});

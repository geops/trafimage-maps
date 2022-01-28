import React from 'react';
import { MatomoProvider } from '@datapunt/matomo-tracker-react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import MatomoTracker from './MatomoTracker';
import getStore from '../../model/store';
import {
  setConsentGiven,
  setActiveTopic,
  setDisableCookies,
} from '../../model/app/actions';

describe.only('MatomoTracker', () => {
  let matomo;
  let store;

  beforeEach(() => {
    matomo = {
      pushInstruction: jest.fn(),
      trackPageView: jest.fn(),
      trackEvent: jest.fn(),
    };

    store = getStore();
  });

  test('shoud do nothing before consent is given.', () => {
    mount(
      <MatomoProvider value={matomo}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );

    expect(matomo.pushInstruction).toHaveBeenCalledTimes(0);
    expect(matomo.trackPageView).toHaveBeenCalledTimes(0);
    expect(matomo.trackEvent).toHaveBeenCalledTimes(0);
  });

  test('shoud do nothing if matomo is not defined.', () => {
    mount(
      <MatomoProvider value={null}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );

    expect(matomo.pushInstruction).toHaveBeenCalledTimes(0);
    expect(matomo.trackPageView).toHaveBeenCalledTimes(0);
    expect(matomo.trackEvent).toHaveBeenCalledTimes(0);
  });

  test('shoud start tracking page view when consent is given.', () => {
    mount(
      <MatomoProvider value={matomo}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );

    act(() => {
      store.dispatch(setConsentGiven(true));
    });

    expect(matomo.pushInstruction).toHaveBeenCalledTimes(1);
    expect(matomo.pushInstruction).toHaveBeenCalledWith('setConsentGiven');
    expect(matomo.trackPageView).toHaveBeenCalledTimes(1);
    expect(matomo.trackEvent).toHaveBeenCalledTimes(0);
  });

  test('shoud disable cookies just after that the consent is given.', () => {
    mount(
      <MatomoProvider value={matomo}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );

    act(() => {
      store.dispatch(setDisableCookies(true));
      store.dispatch(setConsentGiven(true));
    });

    expect(matomo.pushInstruction).toHaveBeenCalledTimes(2);
    expect(matomo.pushInstruction.mock.calls[0][0]).toBe('setConsentGiven');
    expect(matomo.pushInstruction.mock.calls[1][0]).toBe('disableCookies');
    expect(matomo.trackPageView).toHaveBeenCalledTimes(1);
    expect(matomo.trackEvent).toHaveBeenCalledTimes(0);
  });

  test('shoud sent tracking event when active topic changed,', () => {
    mount(
      <MatomoProvider value={matomo}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );

    expect(matomo.trackEvent).toHaveBeenCalledTimes(0);

    act(() => {
      store.dispatch(setConsentGiven(true));
      store.dispatch(setActiveTopic({ key: 'foo' }));
    });

    expect(matomo.trackEvent).toHaveBeenCalledTimes(1);
    expect(matomo.trackEvent).toHaveBeenCalledWith({
      action: 'User topic change',
      category: 'foo',
    });
  });

  test('shoud not sent tracking event when topic has already been visited within 30 min,', () => {
    Date.now = jest.fn(() => 1);
    mount(
      <MatomoProvider value={matomo}>
        <Provider store={store}>
          <MatomoTracker />
        </Provider>
      </MatomoProvider>,
    );
    expect(matomo.trackPageView).toHaveBeenCalledTimes(0);

    act(() => {
      store.dispatch(setConsentGiven(true));
      store.dispatch(setActiveTopic({ key: 'foo' }));
    });

    expect(matomo.trackEvent).toHaveBeenCalledTimes(1);
    expect(matomo.trackEvent.mock.calls[0][0]).toEqual({
      action: 'User topic change',
      category: 'foo',
    });

    act(() => {
      store.dispatch(setActiveTopic({ key: 'bar' }));
    });

    expect(matomo.trackEvent).toHaveBeenCalledTimes(2);
    expect(matomo.trackEvent.mock.calls[1][0]).toEqual({
      action: 'User topic change',
      category: 'bar',
    });

    act(() => {
      store.dispatch(setActiveTopic({ key: 'foo' }));
    });

    expect(matomo.trackEvent).toHaveBeenCalledTimes(2);

    // > 1s + 30min + 1s
    Date.now = jest.fn(() => 30 * 60 * 1000 + 2);

    act(() => {
      store.dispatch(setActiveTopic({ key: 'bar' }));
    });

    expect(matomo.trackEvent).toHaveBeenCalledTimes(3);
    Date.now.mockRestore();
  });
});

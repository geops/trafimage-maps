import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import getStore from '../../model/store';
import Head from '.';

describe('Head', () => {
  let store;

  beforeEach(() => {
    store = getStore();
  });

  test('does nothing by default', () => {
    const component = mount(
      <Provider store={store}>
        <Head />
      </Provider>,
    );
    expect(component.html()).toBe('');
  });

  test('does nothing until displayConsent is true', () => {
    const component = mount(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent={false} />
      </Provider>,
    );
    expect(component.html()).toBe('');
  });

  test('add consent script in HEAD', () => {
    // Here we don't test react-helmet we expect it to work, we just test the script is well added to react-helmet.
    // We let cypress test if the script is in the head.
    const wrapper = mount(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent />
      </Provider>,
    );
    expect(wrapper.find('NullComponent').props().script[1]).toEqual({
      charset: 'UTF-8',
      'data-cy': 'consent-script',
      'data-domain-script': 'foo',
      'data-language': 'de-ch',
      src: 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js',
      type: 'text/javascript',
    });
  });

  test('add consent script in HEAD with the current language value', () => {
    store = global.mockStore({
      app: { language: 'fr' },
    });
    // Here we don't test react-helmet we expect it to work, we just test the script is well added to react-helmet.
    // We let cypress test if the script is in the head.
    const wrapper = mount(
      <Provider store={store}>
        <Head topics={[{}]} domainConsentId="foo" displayConsent />
      </Provider>,
    );
    expect(
      wrapper.find('NullComponent').props().script[1]['data-language'],
    ).toEqual('fr-ch');
  });
});

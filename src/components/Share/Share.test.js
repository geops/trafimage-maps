import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Map, View } from 'ol';
import { MatomoProvider } from '@jonkoops/matomo-tracker-react';
import Share from '.';

describe('Share', () => {
  let store;
  beforeEach(() => {
    store = global.mockStore({
      map: {},
      app: {
        map: new Map({ view: new View({}) }),
        activeTopic: {
          key: 'test',
        },
        language: 'de',
        appBaseUrl: 'https://maps.trafimage.ch',
      },
    });
  });

  test('should match snapshot.', () => {
    const { container } = render(
      <MatomoProvider value={{}}>
        <Provider store={store}>
          <Share />
        </Provider>
      </MatomoProvider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  describe('should send track event on click', () => {
    let matomo;
    let container;

    beforeEach(() => {
      matomo = {
        pushInstruction: jest.fn(),
        trackPageView: jest.fn(),
        trackEvent: jest.fn(),
      };
      const wrapper = render(
        <MatomoProvider value={matomo}>
          <Provider store={store}>
            <Share />
          </Provider>
        </MatomoProvider>,
      );
      container = wrapper.container;
    });

    test('on permalink button', () => {
      fireEvent.click(
        container.querySelector('.wkp-permalink-bt div[role=button]'),
      );
      expect(matomo.trackEvent).toBeCalledWith({
        action: 'clickSharePermalink',
        category: 'test',
      });
    });

    test('on mail button', () => {
      fireEvent.click(container.querySelector('.ta-mail-icon a'));
      expect(matomo.trackEvent).toBeCalledWith({
        action: 'clickShareMail',
        category: 'test',
      });
    });

    test('on download button', () => {
      fireEvent.click(container.querySelector('.rs-canvas-save-button'));
      expect(matomo.trackEvent).toBeCalledWith({
        action: 'clickShareDownload',
        category: 'test',
      });
    });

    test('on facebook button', () => {
      fireEvent.click(container.querySelector('.ta-facebook-icon a'));
      expect(matomo.trackEvent).toBeCalledWith({
        action: 'clickShareFacebook',
        category: 'test',
      });
    });

    test('on twitter button', () => {
      fireEvent.click(container.querySelector('.ta-twitter-icon a'));
      expect(matomo.trackEvent).toBeCalledWith({
        action: 'clickShareTwitter',
        category: 'test',
      });
    });
  });
});

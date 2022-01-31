import React from 'react';
import renderer from 'react-test-renderer';
import { createInstance } from '@datapunt/matomo-tracker-react';
import TrafimageMaps from '.';

describe('TrafimageMaps', () => {
  describe('tracking and consent', () => {
    test('disabled', () => {
      const component = renderer.create(
        <TrafimageMaps apiKey="" enableTracking={false} topics={[]} />,
      );
      expect(component.getInstance().matomo).toBeUndefined();
      expect(createInstance).toHaveBeenCalledTimes(0);
      expect(window.OptanonWrapper).toBeUndefined();
    });

    test.only('enabled by default and active consent mechanism.', () => {
      const component = renderer.create(
        <TrafimageMaps apiKey="" topics={[]} />,
      );
      expect(createInstance).toHaveBeenCalledTimes(1);
      expect(createInstance).toHaveBeenCalledWith({
        siteId: '9',
        trackerUrl: 'https://analytics.geops.de/piwik.php',
        urlBase: 'https://analytics.geops.de/',
      });
      expect(component.getInstance().matomo).toBeDefined();
      expect(
        component.getInstance().matomo.pushInstruction,
      ).toHaveBeenCalledTimes(1);
      expect(
        component.getInstance().matomo.pushInstruction,
      ).toHaveBeenCalledWith('requireConsent');
      expect(window.OptanonWrapper).toBeDefined();
    });

    describe('OptanonWrapper callback .', () => {
      let store;
      let optW;

      beforeEach(() => {
        const component = renderer.create(
          <TrafimageMaps apiKey="" enableTracking topics={[]} />,
        );
        store = component.getInstance().store;
        store.dispatch = jest.fn();
        optW = window.OptanonWrapper;
        expect(window.Optanon).toBeUndefined();
        expect(optW).toBeDefined();
      });

      afterEach(() => {
        window.Optanon = undefined;
        window.OptanonWrapper = undefined;
        window.OptanonActiveGroups = undefined;
      });

      test('does nothing if Optanon is undefined.', () => {
        expect(optW()).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledTimes(0);
      });

      test('does nothing if IsAlertBoxClosed return false.', () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return false;
          },
        };
        expect(optW()).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledTimes(0);
      });

      test('dispatches only consentGiven if IsAlertBoxClosed return true and C002 group is allowed', () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return true;
          },
        };
        window.OptanonActiveGroups = 'C0001,C0002,C0003';
        expect(optW()).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          data: true,
          type: 'SET_CONSENT_GIVEN',
        });
      });

      test('dispatches consentGiven and disbleCookies if IsAlertBoxClosed return true and C002 group is not allowed', () => {
        window.Optanon = {
          IsAlertBoxClosed: () => {
            return true;
          },
        };
        window.OptanonActiveGroups = 'C0001,C0004,C0203';
        expect(optW()).toBe(undefined);
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch.mock.calls[0][0]).toEqual({
          data: true,
          type: 'SET_DISABLE_COOKIES',
        });
        expect(store.dispatch.mock.calls[1][0]).toEqual({
          data: true,
          type: 'SET_CONSENT_GIVEN',
        });
      });
    });
  });
});

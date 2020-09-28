import React from 'react';
import renderer from 'react-test-renderer';
import TrafimageMaps from '.';

describe('TrafimageMaps', () => {
  describe('tracking', () => {
    test('disabled by default', () => {
      const component = renderer.create(
        <TrafimageMaps apiKey="" topics={[]} />,
      );
      expect(component.getInstance().matomo).toBeUndefined();
    });

    test('enabled', () => {
      const component = renderer.create(
        <TrafimageMaps apiKey="" enableTracking topics={[]} />,
      );
      expect(component.getInstance().matomo).toBeDefined();
    });
  });
});

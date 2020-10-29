import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../themes/default';
import AusbauLayer from '../../layers/AusbauLayer';
import AusbauFilters from '.';

describe('AusbauFilters', () => {
  let layer;

  beforeEach(() => {
    layer = new AusbauLayer();
  });

  describe('should match snapshot', () => {
    test('if no layer defined, should display null.', () => {
      const component = renderer.create(
        <ThemeProvider theme={theme}>
          <AusbauFilters />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('if showFilterParam is false, should display null.', () => {
      const component = renderer.create(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('if showFilterParam is true, should display a select box', () => {
      layer.showFilterParam = 'true';
      const component = renderer.create(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

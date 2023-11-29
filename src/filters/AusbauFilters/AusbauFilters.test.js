import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
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
      const component = render(
        <ThemeProvider theme={theme}>
          <AusbauFilters />
        </ThemeProvider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test('if showFilterParam is undefined or null, should display null.', () => {
      const component = render(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test('if showFilterParam is true, should display a select box.', () => {
      layer.showFilterParam = 'true';
      const component = render(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test('if showFilterParam is an empty string, should display a select box.', () => {
      layer.showFilterParam = '';
      const component = render(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });
  });
});

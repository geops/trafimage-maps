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
          <AusbauFilters layer={null} />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('if isShowFilter is false, should display null.', () => {
      const component = renderer.create(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    test('if isShowFilter is true, should display a select box', () => {
      layer.isShowFilter = true;
      const component = renderer.create(
        <ThemeProvider theme={theme}>
          <AusbauFilters layer={layer} />
        </ThemeProvider>,
      );
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  // test("update the layer's filter on change", () => {
  //   layer.isShowFilter = true;
  //   // const spy = jest.spyOn(layer, 'applyNewFilter');
  //   const wrapper = shallow(
  //     <ThemeProvider theme={theme}>
  //       <AusbauFilters layer={layer} />
  //     </ThemeProvider>,
  //   );
  //   // wrapper.find(Select).change();
  // });
});

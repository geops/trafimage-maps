import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FeaturePagination from '.';

configure({ adapter: new Adapter() });

describe('ExportDialog', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <FeaturePagination
        features={[{}, {}, {}]}
        featureIndex={0}
        setFeatureIndex={() => {}}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

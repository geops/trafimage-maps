import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Link from '.';

configure({ adapter: new Adapter() });

describe('Link', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <Link href="https://geops.de/">geOps</Link>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

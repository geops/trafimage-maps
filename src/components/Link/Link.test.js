import React from 'react';
import renderer from 'react-test-renderer';
import Link from '.';

describe('Link', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(
      <Link href="https://geops.de/">geOps</Link>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

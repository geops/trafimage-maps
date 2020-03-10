import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import SharePermalinkButton from '.';

describe('SharePermalinkButton', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<SharePermalinkButton />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

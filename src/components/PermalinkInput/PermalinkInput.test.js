import React from 'react';
import renderer from 'react-test-renderer';
import PermalinkInput from '.';

describe('PermalinkInput', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<PermalinkInput />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

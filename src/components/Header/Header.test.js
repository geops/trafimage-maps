import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Header from './Header';

describe('Header', () => {
  test('match snapshots', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Header appBaseUrl="http://foo.de" />);
    const tree = renderer.getRenderOutput();
    expect(tree).toMatchSnapshot();
  });
});

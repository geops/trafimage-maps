import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Header from './Header';

describe('Header', () => {
  test('match snapshots', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Header />);
    const tree = renderer.getRenderOutput();
    expect(tree).toMatchSnapshot();
    // Login & LanguageSelect are snapshoted as 'UNDEFINED' due to React.Memo
    // It will be solved in jest.v25: https://github.com/facebook/jest/issues/9216
  });
});

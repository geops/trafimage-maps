import React from 'react';
import { render } from '@testing-library/react';
import PermalinkInput from '.';

describe('PermalinkInput', () => {
  test('should match snapshot.', () => {
    const component = render(<PermalinkInput />);
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import Link from '.';

describe('Link', () => {
  test('should match snapshot.', () => {
    const component = render(<Link href="https://geops.de/">geOps</Link>);
    expect(component.container.innerHTML).toMatchSnapshot();
  });
});

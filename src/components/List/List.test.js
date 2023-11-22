import React from 'react';
import { render } from '@testing-library/react';
import List from './List';

describe('List', () => {
  describe('when no properties are set', () => {
    let spy = null;

    beforeEach(() => {
      window.console.error = jest.fn().mockImplementation(() => {});
      spy = jest.spyOn(window.console, 'error');
    });

    afterEach(() => {
      spy.mockRestore();
      window.console.error.mockRestore();
    });

    test('displays 1 error for required property ', () => {
      render(<List />);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('matches snapshot', () => {
      const component = render(<List />);
      expect(component.container.innerHTML).toMatchSnapshot();
    });
  });

  describe('when properties are set', () => {
    const defaultItems = [
      {
        label: 'foo',
      },
      {
        label: 'bar',
      },
      {
        label: 'foo2',
      },
    ];

    const items = [
      {
        label: 'qux',
      },
      {
        label: 'quux',
      },
      {
        label: 'corge',
      },
    ];

    test('matches snapshot with defaultItems', () => {
      const component = render(
        <List
          className="tm-foo"
          defaultItems={defaultItems}
          renderTitle={() => 'my_foo_title'}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test('matches snapshot with items', () => {
      const component = render(
        <List
          className="tm-foo"
          defaultItems={defaultItems}
          items={items}
          renderTitle={() => 'my_foo_title'}
          renderItem={(item) => item.label}
          getItemKey={() => Math.random()}
          onSelect={() => {}}
        />,
      );
      expect(component.container.innerHTML).toMatchSnapshot();
    });
  });
});

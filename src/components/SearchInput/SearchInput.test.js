import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
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
      render(<SearchInput />);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    test('matches snapshot', () => {
      const component = render(<SearchInput />);
      expect(component.container.innerHTML).toMatchSnapshot();
    });

    test('calls default onBlurInput, onFocus, onKeyPress without errors.', () => {
      const wrapper = render(<SearchInput />);
      const input = wrapper.container.querySelector('input');
      input.focus();
      input.blur();
      fireEvent.keyDown(input);
      fireEvent.keyUp(input);
    });
  });

  describe('when properties are set', () => {
    test('matches snapshot ', () => {
      const { container } = render(
        <SearchInput
          value="bar"
          className="tm-foo"
          placeholder="gux"
          onBlur={() => {}}
          onKeyPress={() => {}}
          onChange={() => {}}
        />,
      );
      expect(container.innerHTML).toMatchSnapshot();
      container.querySelector('input').focus();
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('matches snapshot when className is undefined ', () => {
      const { container } = render(<SearchInput className={undefined} />);
      expect(container.innerHTML).toMatchSnapshot();
    });

    test('calls onBlurInput, onFocus, onKeyPress properties.', () => {
      const fn = jest.fn();
      const { container } = render(
        <SearchInput onBlurInput={fn} onFocus={fn} onKeyPress={fn} />,
      );
      const input = container.querySelector('input');
      input.focus();
      input.blur();
      fireEvent.keyDown(input);
      fireEvent.keyUp(input);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    // TODO to fix this test should work as it is
    test.skip('searchs on input change event.', () => {
      userEvent.setup();
      const fn = jest.fn();
      const { container } = render(<SearchInput onChange={fn} />);
      const input = container.querySelectorAll('input')[0];
      input.focus();
      userEvent.keyboard('test');
      fireEvent.keyUp(input, { target: { value: 'foo' } });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('searchs with an empty string on click on cross button.', () => {
      const fn = jest.fn();
      const { container } = render(<SearchInput onChange={fn} />);
      const input = container.querySelectorAll('input')[0];
      input.focus();
      fireEvent.click(container.querySelector('.tm-button'));
      expect(fn).toHaveBeenCalledTimes(1);
      expect(input).toBe(document.activeElement);
    });

    test('trigger onClickSearchButton callback.', () => {
      const fn = jest.fn();
      const { container } = render(<SearchInput onClickSearchButton={fn} />);
      const input = container.querySelectorAll('input')[0];
      input.focus();
      fireEvent.click(container.querySelectorAll('.tm-bt-search')[0]);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('trigger onClearClick callback.', () => {
      const fn = jest.fn();
      const { container } = render(<SearchInput onClearClick={fn} />);
      fireEvent.click(container.querySelectorAll('.tm-button')[0]);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('searchs on enter key up.', () => {
      userEvent.setup();
      const fn = jest.fn();
      const { container } = render(<SearchInput onChange={fn} />);
      const input = container.querySelectorAll('input')[0];
      input.focus();
      fireEvent.keyUp(input, { keyCode: 13, which: 13 });
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('focuses the input on state change.', () => {
      const { container } = render(<SearchInput />);
      const input = container.querySelectorAll('input')[0];
      input.focus();
      expect(input).toBe(document.activeElement);
    });
  });
});

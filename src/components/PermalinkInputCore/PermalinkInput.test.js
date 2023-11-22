import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PermalinkInput from './PermalinkInput';

describe('PermalinkInput', () => {
  test('matches snapshot', () => {
    const component = render(<PermalinkInput value="http://url.test" />);
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  describe('when interacts,', () => {
    let getShortenedUrl = null;

    beforeEach(() => {
      getShortenedUrl = jest.fn((val) => {
        return Promise.resolve(val);
      });
    });

    test('getShortenedUrl is called to set value.', () => {
      render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );

      expect(getShortenedUrl).toHaveBeenCalledTimes(1);
      expect(getShortenedUrl).toHaveBeenCalledWith('http://url.test');
    });

    test('select value on input click.', () => {
      document.execCommand = jest.fn();
      const wrapper = render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(document, 'execCommand');

      expect(spy).toHaveBeenCalledTimes(0);
      fireEvent.click(wrapper.container.querySelector('input'));
      expect(spy).toHaveBeenCalledWith('selectall');
    });

    test('click button copy the value.', () => {
      document.execCommand = jest.fn();
      const wrapper = render(
        <PermalinkInput
          getShortenedUrl={getShortenedUrl}
          value="http://url.test"
        />,
      );
      const spy = jest.spyOn(document, 'execCommand');

      expect(spy).toHaveBeenCalledTimes(0);
      fireEvent.click(wrapper.container.querySelector('.tm-permalink-bt'));

      expect(spy).toHaveBeenCalledWith('copy');
    });
  });
});

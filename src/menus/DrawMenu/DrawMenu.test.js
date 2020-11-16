import React from 'react';
import { shallow } from 'enzyme';
import DrawMenu from './DrawMenu';
import MenuItem from '../../components/Menu/MenuItem';
import Draw from '../../components/Draw';

describe('DrawMenu', () => {
  test('should use MenuItem and display Draw', () => {
    const wrapper = shallow(<DrawMenu />);
    expect(wrapper.find(MenuItem).length).toBe(1);
    expect(wrapper.find(MenuItem).prop('title')).toBe('Zeichnen of der Karte');
    expect(wrapper.find(Draw).length).toBe(1);
  });
});

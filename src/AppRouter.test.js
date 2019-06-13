import 'jest-canvas-mock';
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import AppRouter from './AppRouter';

configure({ adapter: new Adapter() });

describe('AppRouter', () => {
  test('should match snapshot', () => {
    const component = renderer.create(<AppRouter />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

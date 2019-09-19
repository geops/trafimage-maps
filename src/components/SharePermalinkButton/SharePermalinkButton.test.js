import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SharePermalinkButton from '.';

configure({ adapter: new Adapter() });

describe('SharePermalinkButton', () => {
  test('should match snapshot.', () => {
    const component = renderer.create(<SharePermalinkButton />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

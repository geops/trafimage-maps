import 'jest-canvas-mock';
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Map, View } from 'ol';
import Share from '.';

configure({ adapter: new Adapter() });

describe('Share', () => {
  let map;

  beforeEach(() => {
    map = new Map({ view: new View({}) });
  });

  test('should match snapshot.', () => {
    const component = renderer.create(<Share map={map} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

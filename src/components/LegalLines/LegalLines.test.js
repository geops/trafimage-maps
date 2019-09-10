import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LegalLines from './LegalLines';

configure({ adapter: new Adapter() });

describe('LegalLines', () => {
  test('uses default  properties', () => {
    window.console.error = jest.fn().mockImplementation(() => {});
    const component = renderer.create(<LegalLines />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  ['rechtliches', 'impressum', 'kontakt'].forEach(doc => {
    ['de', 'fr', 'en', 'it'].forEach(lng => {
      test(`should match snapshot with doc=${doc} and language=${lng}`, () => {
        const component = renderer.create(
          <LegalLines doc={doc} language={lng} />,
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import FooterDialogContent from './FooterDialogContent';

configure({ adapter: new Adapter() });

describe('FooterDialogContent', () => {
  test('uses default  properties', () => {
    window.console.error = jest.fn().mockImplementation(() => {});
    const component = renderer.create(<FooterDialogContent />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  ['foo'].forEach(doc => {
    ['de', 'bar'].forEach(lng => {
      test(`redirect to bern if bad values are given with doc=${doc} and language=${lng}.`, () => {
        const component = renderer.create(
          <Router>
            <Route exact path="/:alias" component={() => 'Redirect to bern'} />
            <Route
              exact
              path="/"
              render={() => <FooterDialogContent doc={doc} language={lng} />}
            />
          </Router>,
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });

  ['rechtliches', 'impressum', 'kontakt'].forEach(doc => {
    ['de', 'fr', 'en', 'it'].forEach(lng => {
      test(`should match snapshot with doc=${doc} and language=${lng}`, () => {
        const component = renderer.create(
          <FooterDialogContent doc={doc} language={lng} />,
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});

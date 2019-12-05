import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import HandicapPopupElement from './HandicapPopupElement';
import 'react-app-polyfill/stable';

configure({ adapter: new Adapter() });

describe('HandicapPopupElement', () => {
  const props = {
    treffpunkt_de: '',
    zusaetzliche_informationen_de: `Test line here
      +33 666 66 66
      admin@email.it
      (text)
      LU-Tixi
      foo bar baz
      www.test.ch
      Dritte Dienstleistung
      Freiburg
      +41 (0) 41 210 00 60
      www.geops.ch`,
  };

  test('matches empty snapshot.', () => {
    const component = renderer.create(
      <HandicapPopupElement
        key="TreffPunkt"
        label="TreffPunkt"
        properties={props}
        propertyName="treffpunkt_de"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("matches 'Zusätzliche Informationen' snapshot.", () => {
    const component = renderer.create(
      <HandicapPopupElement
        key="Zusätzliche Informationen"
        label="Zusätzliche Informationen"
        properties={props}
        propertyName="zusaetzliche_informationen_de"
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  [
    '061 777 66 66',
    '041 999 37 37',
    '+42 (0) 41 210 00 60',
    '056 632 12 21',
  ].forEach(number => {
    test(`should render telephone number '${number}' in href.`, () => {
      const wrapper = mount(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: number,
          }}
          propertyName="test"
        />,
      );
      const telHref = wrapper
        .find('a')
        .first()
        .getDOMNode();
      expect(telHref.getAttribute('href')).toBe(`tel:${number}`);
    });
  });

  ['test@test.fr', 'bla@lutixi.ch', 'foo@bluewin.ch'].forEach(email => {
    test(`should render email '${email}' in href.`, () => {
      const wrapper = mount(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: email,
          }}
          propertyName="test"
        />,
      );
      const telHref = wrapper
        .find('a')
        .first()
        .getDOMNode();
      expect(telHref.getAttribute('href')).toBe(`mailto:${email}`);
    });
  });

  test(`should handle several emails in the same input.`, () => {
    const wrapper = mount(
      <HandicapPopupElement
        key="test"
        label="test"
        properties={{
          test: 'test jean-jacques@hotmail.ch test another-address@email.zz',
        }}
        propertyName="test"
      />,
    );
    const firstTelHref = wrapper
      .find('a')
      .first()
      .getDOMNode();
    const secondTelHref = wrapper
      .find('a')
      .at(1)
      .getDOMNode();

    expect(firstTelHref.getAttribute('href')).toBe(
      'mailto:jean-jacques@hotmail.ch',
    );
    expect(secondTelHref.getAttribute('href')).toBe(
      'mailto:another-address@email.zz',
    );
  });

  ['www.geops.ch', 'www.test.ch/foo/bar/baz'].forEach(url => {
    test(`should render urls '${url}' in href.`, () => {
      const wrapper = mount(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: url,
          }}
          propertyName="test"
        />,
      );
      const telHref = wrapper
        .find('a')
        .first()
        .getDOMNode();
      expect(telHref.getAttribute('href')).toBe(`http://${url}`);
    });
  });
});

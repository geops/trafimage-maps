import React from 'react';
import { render } from '@testing-library/react';
import HandicapPopupElement from './HandicapPopupElement';
import 'react-app-polyfill/stable';

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
    const component = render(
      <HandicapPopupElement
        key="TreffPunkt"
        label="TreffPunkt"
        properties={props}
        propertyName="treffpunkt_de"
      />,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  test("matches 'Zusätzliche Informationen' snapshot.", () => {
    const component = render(
      <HandicapPopupElement
        key="Zusätzliche Informationen"
        label="Zusätzliche Informationen"
        properties={props}
        propertyName="zusaetzliche_informationen_de"
      />,
    );
    expect(component.container.innerHTML).toMatchSnapshot();
  });

  [
    '061 777 66 66',
    '041 999 37 37',
    '+42 (0) 41 210 00 60',
    '056 632 12 21',
  ].forEach((number) => {
    test(`should render telephone number '${number}' in href.`, () => {
      const { container } = render(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: number,
          }}
          propertyName="test"
        />,
      );
      const telHref = container.querySelector('a');
      expect(telHref.getAttribute('href')).toBe(`tel:${number}`);
    });
  });

  ['061', '1807 Blonay', 'Route de Brent 2'].forEach((string) => {
    test(`should not render telephone number for '${string}'.`, () => {
      const { container } = render(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: string,
          }}
          propertyName="test"
        />,
      );
      const children = container.querySelector(
        '.wkp-handicap-popup-field-body',
      ).outerHTML;
      expect(children).toBe(
        `<p class="wkp-handicap-popup-field-body">${string}</p>`,
      );
    });
  });

  ['test@test.fr', 'bla@lutixi.ch', 'foo@bluewin.ch'].forEach((email) => {
    test(`should render email '${email}' in href.`, () => {
      const { container } = render(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: email,
          }}
          propertyName="test"
        />,
      );
      const telHref = container.querySelector('a');
      expect(telHref.getAttribute('href')).toBe(`mailto:${email}`);
    });
  });

  test(`should handle several emails in the same input.`, () => {
    const { container } = render(
      <HandicapPopupElement
        key="test"
        label="test"
        properties={{
          test: 'test jean-jacques@hotmail.ch test another-address@email.zz',
        }}
        propertyName="test"
      />,
    );
    const firstTelHref = container.querySelector('a');
    const secondTelHref = container.querySelectorAll('a')[1];

    expect(firstTelHref.getAttribute('href')).toBe(
      'mailto:jean-jacques@hotmail.ch',
    );
    expect(secondTelHref.getAttribute('href')).toBe(
      'mailto:another-address@email.zz',
    );
  });

  ['www.geops.ch', 'www.test.ch/foo/bar/baz'].forEach((url) => {
    test(`should render urls '${url}' in href.`, () => {
      const { container } = render(
        <HandicapPopupElement
          key="test"
          label="test"
          properties={{
            test: url,
          }}
          propertyName="test"
        />,
      );
      const telHref = container.querySelector('a');
      expect(telHref.getAttribute('href')).toBe(`http://${url}`);
    });
  });

  test(`should not add http to href.`, () => {
    const url = 'https://www.geops.ch';
    const { container } = render(
      <HandicapPopupElement
        key="test"
        label="test"
        properties={{
          test: url,
        }}
        propertyName="test"
      />,
    );
    const telHref = container.querySelector('a');
    expect(telHref.getAttribute('href')).toBe(url);
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { Feature } from 'ol';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import SchmalspurPopup from '.';
import SchmalspurLayer from '../../layers/SchmalspurLayer';

describe('SchmalspurPopup', () => {
  let store;

  beforeEach(() => {
    store = global.mockStore({
      map: {},
      app: {},
    });
  });

  test('displays isb_tu_nummer', () => {
    global.i18n.addResourceBundle('de', 'translation', {
      'zur Webseite von': 'zur Webseite von {{operator}}',
    });
    const layer = new SchmalspurLayer({
      mapboxLayer: new MapboxLayer({ url: 'https://foo' }),
    });
    layer.tuInfos = {
      50: { long_name: 'long_name', name: 'foo', url_de: 'https://foo.de' },
    };
    const { container } = render(
      <Provider store={store}>
        <SchmalspurPopup
          feature={new Feature({ isb_tu_nummer: '50' })}
          layer={layer}
        />
      </Provider>,
    );
    expect(container.textContent).toBe(
      'bei long_name.zur Webseite von fooLink.svg',
    );
  });
});

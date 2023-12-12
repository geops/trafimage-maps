import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { Feature } from 'ol';
import { MapboxLayer } from 'mobility-toolbox-js/ol';
import SchmalspurPopup from '.';
import RailplusLayer from '../../layers/RailplusLayer';

describe('SchmalspurPopup', () => {
  let store;

  beforeEach(() => {
    store = global.mockStore({
      map: {},
      app: {},
    });
  });

  test('displays isb_tu_nummer', () => {
    const layer = new RailplusLayer({
      mapboxLayer: new MapboxLayer({ url: 'https://foo' }),
    });
    layer.railplusProviders = { foo: { long_name: 'long_name' } };
    const { container } = render(
      <Provider store={store}>
        <SchmalspurPopup
          feature={new Feature({ isb_tu_nummer: 'foo' })}
          layer={layer}
        />
      </Provider>,
    );
    expect(container.textContent).toBe('long_name');
  });
});

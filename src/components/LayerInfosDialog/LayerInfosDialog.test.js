import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Vector';
import { bahnhofplaene } from '../../config/ch.sbb.netzkarte';
import LayerInfosDialog from '.';

describe('LayerInfosDialog', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let layer;

  beforeEach(() => {
    layer = new Layer({
      name: 'test',
      olLayer: new OLLayer(),
      properties: {
        description: 'description<br/>break',
      },
    });
    store = mockStore({
      app: {
        language: 'de',
        t: (t) => t,
      },
    });
  });

  test('should match snapshot when Layer is null', () => {
    const { container } = render(
      <Provider store={store}>
        <LayerInfosDialog />
      </Provider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  test('should match snapshot when Layer is defined', () => {
    const { container } = render(
      <Provider store={store}>
        <LayerInfosDialog selectedForInfos={layer} />
      </Provider>,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  describe('should display data link ', () => {
    test('for layer bahnhofplaene', () => {
      const { container } = render(
        <Provider store={store}>
          <LayerInfosDialog selectedForInfos={bahnhofplaene} />
        </Provider>,
      );

      const link = container.querySelector('a.wkp-link');
      expect(link.href).toBe(
        'https://data.sbb.ch/explore/dataset/haltestelle-karte-trafimage/information/',
      );
    });
  });
});

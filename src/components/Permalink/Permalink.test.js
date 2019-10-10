import 'jest-canvas-mock';
import React from 'react';
import thunk from 'redux-thunk';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import LayerService from 'react-spatial/LayerService';
import Layer from 'react-spatial/layers/Layer';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Map, View } from 'ol';
import Permalink from './Permalink';

configure({ adapter: new Adapter() });

describe('Permalink', () => {
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore({
      map: {},
      app: {
        activeTopic: {
          key: 'topic',
          name: 'topic name',
          projection: 'EPSG:3857',
        },
        layerService: new LayerService([
          new Layer({
            name: 'testLayer',
            olLayer: new VectorLayer({
              source: new VectorSource(),
            }),
          }),
        ]),
        map: new Map({ view: new View({}) }),
      },
    });
  });

  test('shoud initialize Permalink with layerService.', () => {
    expect(window.location.search).toEqual('');
    mount(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual('?layers=testlayer');
  });

  test("shoud remove space from 'tripNumber' Tracker filter.", () => {
    window.history.pushState({}, undefined, '/?tripNumber=150, 200, 300');
    mount(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?layers=testlayer&tripNumber=150,200,300',
    );
  });

  test("shoud remove space from 'operator' Tracker filter.", () => {
    window.history.pushState({}, undefined, '/?operator=sbb,  zsg');
    mount(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?layers=testlayer&operator=sbb,zsg',
    );
  });

  test("shoud remove space from 'publishedLineName' Tracker filter.", () => {
    window.history.pushState({}, undefined, '/?publishedLineName=2068, 3003 ');
    mount(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?layers=testlayer&publishedLineName=2068,3003',
    );
  });
});

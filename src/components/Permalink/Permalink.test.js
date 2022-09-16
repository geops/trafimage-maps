import React from 'react';
import { act } from 'react-dom/test-utils';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Layer } from 'mobility-toolbox-js/ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Map, View } from 'ol';
import OLLayer from 'ol/layer/Layer';
import fetchMock from 'fetch-mock';
import LayerService from '../../utils/LayerService';
import Permalink from './Permalink';

describe('Permalink', () => {
  const mockStore = configureStore([thunk]);
  let store;
  let drawLayer;

  beforeEach(() => {
    drawLayer = new Layer({
      name: 'test',
      olLayer: new OLLayer({ source: new VectorSource() }),
      properties: {
        description: 'description<br/>break',
      },
    });
    store = mockStore({
      map: {
        drawLayer,
      },
      app: {
        drawUrl: 'http://drawfoo.ch/',
        language: 'de',
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
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual('?lang=de&layers=testLayer');
  });

  test("shoud remove space from 'tripNumber' Tracker filter.", () => {
    window.history.pushState(
      {},
      undefined,
      '/?lang=de&tripNumber=150, 200, 300',
    );
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?lang=de&layers=testLayer&tripNumber=150,200,300',
    );
  });

  test("shoud remove space from 'operator' Tracker filter.", () => {
    window.history.pushState({}, undefined, '/?lang=de&operator=sbb,  zsg');
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?lang=de&layers=testLayer&operator=sbb,zsg',
    );
  });

  test("shoud remove space from 'publishedLineName' Tracker filter.", () => {
    window.history.pushState(
      {},
      undefined,
      '/?lang=de&publishedLineName=2068, 3003 ',
    );
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?lang=de&layers=testLayer&publishedLineName=2068,3003',
    );
  });

  test('shoud use x,y in mercator.', () => {
    window.history.pushState({}, undefined, '/?x=6456530&y=-7170156 ');
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual(
      '?lang=de&layers=testLayer&x=6456530&y=-7170156',
    );
    expect(store.getActions()[0]).toEqual({
      data: [6456530, -7170156],
      type: 'SET_CENTER',
    });
  });

  test('shoud transform lon,lat to mercator.', () => {
    window.history.pushState({}, undefined, '/?lon=58&lat=-54 ');
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toEqual('?lang=de&layers=testLayer');
    expect(store.getActions()[0]).toEqual({
      data: [6456530.466009867, -7170156.29399995],
      type: 'SET_CENTER',
    });
  });

  describe('shoud load kml if draw.id exists', () => {
    test('if it is a admin_id.', async () => {
      window.history.pushState({}, undefined, '/?lang=de&draw.id=foo');
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(0);
      const drawIds = {
        admin_id: 'qux',
        file_id: 'quu',
      };
      await act(async () => {
        fetchMock.once('http://drawfoo.ch/foo', drawIds);
        fetchMock.once('http://drawfoo.ch/quu', global.sampleKml);
        render(
          <Provider store={store}>
            <Permalink />
          </Provider>,
        );
      });
      expect(window.location.search).toEqual(
        '?draw.id=foo&lang=de&layers=testLayer',
      );
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(1);
      expect(store.getActions().pop()).toEqual({
        data: drawIds,
        type: 'SET_DRAW_IDS',
      });
      fetchMock.restore();
    });

    test('if it is a file_id.', async () => {
      window.history.pushState({}, undefined, '/?lang=de&draw.id=quu');
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(0);
      await act(async () => {
        fetchMock.once('http://drawfoo.ch/quu', global.sampleKml);
        render(
          <Provider store={store}>
            <Permalink />
          </Provider>,
        );
      });
      expect(window.location.search).toEqual(
        '?draw.id=quu&lang=de&layers=testLayer',
      );
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(1);
      expect(store.getActions().pop()).toEqual({
        data: {
          file_id: 'quu',
        },
        type: 'SET_DRAW_IDS',
      });
      fetchMock.restore();
    });
  });

  test('shoud load kml if wkp.draw exists', async () => {
    window.history.pushState({}, undefined, '/?lang=de&wkp.draw=quu');
    expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(0);
    await act(async () => {
      fetchMock.once('http://drawfoo.ch/quu', global.sampleKml);
      render(
        <Provider store={store}>
          <Permalink />
        </Provider>,
      );
    });
    expect(window.location.search).toEqual(
      '?draw.id=quu&lang=de&layers=testLayer',
    );
    expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(1);
    expect(store.getActions().pop()).toEqual({
      data: {
        file_id: 'quu',
      },
      type: 'SET_DRAW_IDS',
    });
    fetchMock.restore();
  });
});

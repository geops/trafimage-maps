import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Layer } from 'mobility-toolbox-js/ol';
import OLLayer from 'ol/layer/Layer';
import { Map, View } from 'ol';
import TopicLoader from '.';

describe('TopicLoader', () => {
  const mockStore = configureStore([thunk]);
  let initialStore = {};
  let store;
  let map;
  const drawLayer = new Layer({ olLayer: new OLLayer({}) });

  beforeEach(() => {
    map = new Map({ view: new View({}) });
    initialStore = {
      map: {
        drawLayer,
        layers: [],
      },
      app: {
        map,
        language: 'de',
        apiKey: 'apikey',
        apiKeyName: 'apiKeyName',
        appBaseUrl: 'https://appBaseUrl.ch',
        staticFilesUrl: 'https://foostatic.ch',
        vectorTilesUrl: 'https://vectorTilesUrl.ch',
        vectorTilesKey: 'apikey',
        searchUrl: 'https://searchUrl.ch',
      },
    };
  });

  test('add draw layer if activeTopic.elements.permalink=true', () => {
    const topicDflt = {
      key: 'topicPermalinkTrue',
      layers: [new Layer({ olLayer: new OLLayer({}) })],
      elements: { permalink: true },
    };
    store = mockStore({
      ...initialStore,
      app: {
        ...initialStore.app,
        activeTopic: topicDflt,
        topics: [topicDflt],
      },
    });

    render(
      <Provider store={store}>
        <TopicLoader />
      </Provider>,
    );
    const action = store
      .getActions()
      .filter((act) => act.type === 'SET_LAYERS');
    expect(action.length).toBe(1);
    expect(action[0].data).toEqual([...topicDflt.layers, drawLayer]);
  });

  test("doesn't add draw layer when activeTopic.elements.permalink=false.", () => {
    const topicPermalinkFalse = {
      key: 'topicPermalinkFalse',
      layers: [new Layer({ olLayer: new OLLayer({}) })],
      elements: {
        permalink: false,
      },
    };
    store = mockStore({
      ...initialStore,
      app: {
        ...initialStore.app,
        activeTopic: topicPermalinkFalse,
        topics: [topicPermalinkFalse],
      },
    });

    render(
      <Provider store={store}>
        <TopicLoader />
      </Provider>,
    );
    const action = store
      .getActions()
      .filter((act) => act.type === 'SET_LAYERS');
    expect(action.length).toBe(1);
    expect(action[0].data).toEqual(topicPermalinkFalse.layers);
  });
});
